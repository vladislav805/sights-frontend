import * as React from 'react';
import './style.scss';
import API, { IUsableComment } from '../../api';
import Entry from './Entry';
import { entriesToMap } from '../../utils';

interface ICommentsProps {
    sightId: number;
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

    private onCommentRemove = async(commentId: number) => {
        const result = await API.comments.remove(commentId);

        result && this.setState(state => ({
            count: state.count,
            comments: state.comments.filter(comment => comment.commentId === commentId),
        }));
    };

    render() {
        return (
            <div className="comments">
                <div className="comments-header">Комментарии</div>
                <div className="comments-content">
                    {this.state?.comments?.map(comment => (
                        <Entry key={comment.commentId} comment={comment} onCommentRemove={this.onCommentRemove} />
                    ))}
                </div>
            </div>
        )
    }
}

export default Comments;
