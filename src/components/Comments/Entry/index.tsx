import * as React from 'react';
import './style.scss';
import { IUsableComment } from '../../../api';
import { humanizeDateTime, Format } from '../../../utils';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCloseThick } from '@mdi/js';

interface ICommentEntryProps {
    comment: IUsableComment;
    onCommentRemove: (sightId: number) => void;
}

const Entry = ({ comment, onCommentRemove }: ICommentEntryProps) => (
    <div className="comment">
        <img
            src={comment.user.photo.photo200}
            alt="Thumb"
            className="comment-photo" />
        <div className="comment-content">
            <div className="comment-header">
                <Link to={`/user/${comment.user.login}`}>{comment.user.firstName} {comment.user.lastName}</Link>
                <div className="comment-date">{humanizeDateTime(new Date(comment.date * 1000), Format.DATE | Format.MONTH_NAME | Format.TIME)}</div>
            </div>
            <div className="comment-text">{comment.text}</div>
        </div>
        {comment.canModify && (
            <div
                className="comment-remove"
                onClick={() => onCommentRemove(comment.commentId)}>
                <Icon
                    path={mdiCloseThick} />
            </div>
        )}
    </div>
);

export default Entry;
