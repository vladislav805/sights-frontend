import * as React from 'react';
import './style.scss';
import API, { IUsableComment } from '../../api';
import Entry from './Entry';
import { entriesToMap, IPluralForms, pluralize } from '../../utils';
import Form from './Form';
import StickyHeader from '../StickyHeader';
import Button from '../Button';
import InfoSplash from '../InfoSplash';
import { mdiCommentProcessingOutline } from '@mdi/js';

interface ICommentsProps {
    sightId: number;
    showForm: boolean;
}

interface ICommentsState {
    count?: number;
    comments?: IUsableComment[];
    loading?: boolean;
}

const commentsPlural: IPluralForms = {
    none: 'комментариев',
    one: 'комментарий',
    some: 'комментария',
    many: 'комментариев',
};

class Comments extends React.Component<ICommentsProps, ICommentsState> {
    state: ICommentsState = {};

    componentDidMount(): void {
        void this.fetchComments(0);
    }

    private fetchComments = async(offset: number) => {
        const { count, items, users } = await API.comments.get(this.props.sightId, 20, offset);

        const usersAssoc = entriesToMap(users, 'userId');

        this.setState(state => ({
            count,
            comments: (state.comments || []).concat(items.map((comment: IUsableComment) => {
                comment.user = usersAssoc.get(comment.userId);
                return comment;
            })),
            loading: false,
        }))
    };

    private onNewCommentSend = async(text: string): Promise<true> => {
        return API.comments.add(this.props.sightId, text).then(({ comment, user }) => {
            const myComment: IUsableComment = { ...comment, user };
            this.setState(state => ({
                count: state.count + 1,
                comments: state.comments.concat(myComment),
            }));
            return true;
        });
    };

    private onCommentRemove = async(commentId: number) => API.comments.remove(commentId);

    private onCommentReport = async(commentId: number) => API.comments.report(commentId);

    private loadNext = () => this.setState({ loading: true }, () => {
        void this.fetchComments(this.state.comments.length);
    });

    render(): JSX.Element {
        const { count, comments, loading } = this.state;
        return (
            <StickyHeader left="Комментарии" right={comments && `${count} ${pluralize(count, commentsPlural)}`}>
                <div className="comments-list">
                    {comments
                        ? comments?.map(comment => (
                            <Entry
                                key={comment.commentId}
                                comment={comment}
                                onCommentRemove={this.onCommentRemove}
                                onCommentReport={this.onCommentReport} />
                        ))
                        : <InfoSplash icon={mdiCommentProcessingOutline} iconSize="s" description="Нет комментариев" />
                    }
                </div>
                {comments && comments.length < count && (
                    <Button
                        className="comments-pagination"
                        label="Далее"
                        loading={loading}
                        color="primary"
                        onClick={this.loadNext} />
                )}
                {this.props.showForm && (
                    <Form onSubmit={this.onNewCommentSend} />
                )}
            </StickyHeader>
        );
    }
}

export default Comments;
