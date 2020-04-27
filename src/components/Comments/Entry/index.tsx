import * as React from 'react';
import './style.scss';
import { IUsableComment } from '../../../api';
import { humanizeDateTime, Format } from '../../../utils';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAlert, mdiCloseThick } from '@mdi/js';
import AttentionBlock from '../../AttentionBlock';

interface ICommentEntryProps {
    comment: IUsableComment;
    onCommentRemove?: (commentId: number) => Promise<true>;
    onCommentReport?: (commentId: number) => Promise<true>;
}

const Entry = ({ comment, onCommentRemove, onCommentReport }: ICommentEntryProps) => {
    const [block, setBlock] = React.useState<string>();
    if (block) {
        return (
            <AttentionBlock type="info" show={!!block} text={block} />
        );
    }

    const onRemove = () => {
        onCommentRemove?.(comment.commentId).then(() => setBlock('Комментарий удалён'));
    };

    const onReport = () => {
        if (confirm(`Вы хотите пожаловаться на комментарий @${comment.user.login}?`)) {
            onCommentReport?.(comment.commentId).then(() => setBlock('Жалоба отправлена. Администраторы в ближайшее время проверят Вашу заявку. Спасибо.'));
        }
    };

    return (
        <div className="comment">
            <img
                src={comment.user.photo.photo200}
                alt="Thumb"
                className="comment-photo" />
            <div className="comment-content">
                <div className="comment-header">
                    <Link to={`/user/${comment.user.login}`}>{comment.user.firstName} {comment.user.lastName}</Link>
                    <div className="comment-date">{humanizeDateTime(new Date(comment.date * 1000), Format.DATE | Format.MONTH_NAME | Format.TIME)}</div>
                    {comment.canModify ? (
                        <div
                            className="comment-remove"
                            title="Удалить"
                            onClick={onRemove}>
                            <Icon path={mdiCloseThick} />
                        </div>
                    ) : (
                        <div
                            className="comment-remove"
                            title="Пожаловаться"
                            onClick={onReport}>
                            <Icon path={mdiAlert} />
                        </div>
                    )}
                </div>
                <div className="comment-text">{comment.text}</div>
            </div>
        </div>
    );
}

export default Entry;
