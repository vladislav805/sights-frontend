import * as React from 'react';
import './style.scss';
import API from '../../api';
import Entry from './Entry';
import { IPluralForms, pluralize } from '../../utils/pluralize';
import { entriesToMap } from '../../utils/entriesToMap';
import Form from './Form';
import StickyHeader from '../StickyHeader';
import InfoSplash from '../InfoSplash';
import { mdiCommentProcessingOutline } from '@mdi/js';
import { IUsableComment } from '../../api/local-types';
import useCurrentUser from '../../hook/useCurrentUser';
import Pagination from '../Pagination';

type ICommentsProps = {
    showForm: boolean;
} & (ICommentsSightProps | ICommentsCollectionProps);

type ICommentsSightProps = {
    type: 'sight';
    sightId: number;
};

type ICommentsCollectionProps = {
    type: 'collection';
    collectionId: number;
};

const commentsPlural: IPluralForms = {
    none: 'комментариев',
    one: 'комментарий',
    some: 'комментария',
    many: 'комментариев',
};

const PEER_PAGE = 20;

const Comments: React.FC<ICommentsProps> = (props: ICommentsProps) => {
    const [count, setCount] = React.useState<number>(-1);
    const [comments, setComments] = React.useState<IUsableComment[]>();
    const currentUser = useCurrentUser();
    const [offset, setOffset] = React.useState<number>(0);

    React.useEffect(() => {
        void fetchComments(offset);
    }, [offset]);

    const fetchComments = async(offset: number) => {
        const { count, items, users } = await API.comments.get({
            sightId: props.type === 'sight' ? props.sightId : undefined,
            collectionId: props.type === 'collection' ? props.collectionId : undefined,
            count: PEER_PAGE,
            offset,
            fields: ['ava'],
        });

        const usersAssoc = entriesToMap(users, 'userId');

        setCount(count);
        setComments(items.map((comment: IUsableComment) => {
            comment.user = usersAssoc.get(comment.userId);
            return comment;
        }));
    };

    const onNewCommentSend = async(text: string): Promise<true> => {
        return API.comments.add({
            sightId: props.type === 'sight' ? props.sightId : undefined,
            collectionId: props.type === 'collection' ? props.collectionId : undefined,
            text,
        }).then(comment => {
            const myComment: IUsableComment = {
                ...comment,
                user: currentUser,
            };

            setCount(count + 1);
            setComments(comments.concat(myComment));
            return true;
        });
    };

    const onCommentRemove = async(commentId: number) => API.comments.remove({ commentId });

    const onCommentReport = async(commentId: number) => API.comments.report({ commentId });

    return (
        <StickyHeader
            left="Комментарии"
            right={comments && `${count} ${pluralize(count, commentsPlural)}`}>
            <div className="comments-list">
                {comments?.length
                    ? comments.map(comment => (
                        <Entry
                            key={comment.commentId}
                            comment={comment}
                            onCommentRemove={onCommentRemove}
                            onCommentReport={onCommentReport} />
                    ))
                    : (
                        <InfoSplash
                            icon={mdiCommentProcessingOutline}
                            iconSize="s"
                            description="Нет комментариев" />
                    )
                }
            </div>
            {comments && (
                <Pagination
                    offset={offset}
                    count={count}
                    by={PEER_PAGE}
                    onOffsetChange={setOffset} />
            )}
            {props.showForm && (
                <Form onSubmit={onNewCommentSend} />
            )}
        </StickyHeader>
    );
}

export default Comments;
