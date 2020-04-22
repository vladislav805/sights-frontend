import * as React from 'react';
import './style.scss';
import API, { IUsableComment } from '../../api';
import Entry from './Entry';
import { entriesToMap } from '../../utils';
import Form from './Form';
import StickyHeader from '../StickyHeader';

interface ICommentsProps {
    sightId: number;
    showForm: boolean;
}

interface ICommentsState {
    count?: number;
    comments?: IUsableComment[];
}

class Comments extends React.Component<ICommentsProps, ICommentsState> {
    componentDidMount() {
        this.fecthComments();
    }

    private fecthComments = async() => {
        const { count, items, users } = await API.comments.get(this.props.sightId);

        const usersAssoc = entriesToMap(users, 'userId');

        this.setState({
            count,
            comments: items.map((comment: IUsableComment) => {
                comment.user = usersAssoc.get(comment.userId);
                return comment;
            }),
        })
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

    private onCommentRemove = async(commentId: number) => {
        const result = await API.comments.remove(commentId);

        result && this.setState(state => ({
            count: state.count - 1,
            comments: state.comments.filter(comment => comment.commentId === commentId),
        }));
    };

    render() {
        return (
            <StickyHeader
                showHeader={true}
                left="Комментарии">
                <div className="comments-list">
                    {this.state?.comments?.map(comment => (
                        <Entry key={comment.commentId} comment={comment} onCommentRemove={this.onCommentRemove} />
                    ))}
                </div>
                {this.props.showForm && (
                    <Form onSubmit={this.onNewCommentSend} />
                )}
            </StickyHeader>
        );
    }
}

export default Comments;
