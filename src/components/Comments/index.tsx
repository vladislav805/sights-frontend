import * as React from 'react';
import './style.scss';
import API from '../../api';
import Entry from './Entry';
import { entriesToMap, IPluralForms, pluralize } from '../../utils';
import Form from './Form';
import StickyHeader from '../StickyHeader';
import Button from '../Button';
import InfoSplash from '../InfoSplash';
import { mdiCommentProcessingOutline } from '@mdi/js';
import { IComponentWithUserProps, withAwaitForUser } from '../../hoc/withAwaitForUser';
import { IUsableComment } from '../../api/local-types';

type ICommentsProps = IComponentWithUserProps & {
    sightId: number;
    showForm: boolean;
};

const commentsPlural: IPluralForms = {
    none: 'комментариев',
    one: 'комментарий',
    some: 'комментария',
    many: 'комментариев',
};

const Comments: React.FC<ICommentsProps> = (props: ICommentsProps) => {
    const [count, setCount] = React.useState<number>(-1);
    const [comments, setComments] = React.useState<IUsableComment[]>();
    const [loading, setLoading] = React.useState<boolean>(true);

    React.useEffect(() => {
        void fetchComments(0);
    }, []);

    const fetchComments = async(offset: number) => {
        const { count, items, users } = await API.comments.get({
            sightId: props.sightId,
            count: 20,
            offset,
            fields: ['ava'],
        });

        const usersAssoc = entriesToMap(users, 'userId');

        setCount(count);
        setComments((comments || []).concat(items.map((comment: IUsableComment) => {
            comment.user = usersAssoc.get(comment.userId);
            return comment;
        })));
        setLoading(false);
    };

    const onNewCommentSend = async(text: string): Promise<true> => {
        return API.comments.add({ sightId: props.sightId, text }).then(comment => {
            const myComment: IUsableComment = {
                ...comment,
                user: props.currentUser,
            };

            setCount(count + 1);
            setComments(comments.concat(myComment));
            return true;
        });
    };

    const onCommentRemove = async(commentId: number) => API.comments.remove(commentId);

    const onCommentReport = async(commentId: number) => API.comments.report(commentId);

    const loadNext = () => {
        setLoading(true);
        void fetchComments(comments.length);
    };

    return (
        <StickyHeader
            left="Комментарии"
            right={comments && `${count} ${pluralize(count, commentsPlural)}`}>
            <div className="comments-list">
                {comments
                    ? comments?.map(comment => (
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
            {comments && comments.length < count && (
                <Button
                    className="comments-pagination"
                    label="Далее"
                    loading={loading}
                    color="primary"
                    onClick={loadNext} />
            )}
            {props.showForm && (
                <Form onSubmit={onNewCommentSend} />
            )}
        </StickyHeader>
    );
}

export default withAwaitForUser(Comments);
