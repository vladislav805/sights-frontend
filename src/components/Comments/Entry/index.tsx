import * as React from 'react';
import './style.scss';
import { humanizeDateTime, Format } from '../../../utils/date';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiAlert, mdiCloseThick } from '@mdi/js';
import AttentionBlock from '../../AttentionBlock';
import { IUsableComment } from '../../../api/local-types';
import DynamicTooltip from '../../DynamicTooltip';
import { showToast } from '../../../ui-non-react/toast';

interface ICommentEntryProps {
    comment: IUsableComment;
    onCommentRemove?: (commentId: number) => Promise<true>;
    onCommentReport?: (commentId: number) => Promise<true>;
}

const Entry: React.FC<ICommentEntryProps> = ({ comment, onCommentRemove, onCommentReport }: ICommentEntryProps) => {
    const [block, setBlock] = React.useState<string>();
    if (block) {
        return (
            <AttentionBlock type="info" show={!!block} text={block} />
        );
    }

    const onRemove = () => {
        void onCommentRemove?.(comment.commentId).then(() => setBlock('Комментарий удалён'));
    };

    const onReport = () => {
        if (confirm(`Вы хотите пожаловаться на комментарий @${comment.user.login}?`)) {
            void onCommentReport?.(comment.commentId)
                .then(() => showToast('Жалоба отправлена. Администраторы в ближайшее время проверят Вашу заявку. Спасибо.'));
        }
    };

    return (
        <div className="comment">
            <DynamicTooltip type="user" id={comment.userId}>
                <img
                    src={comment.user.photo.photo200}
                    alt="Thumb"
                    className="comment-photo" />
            </DynamicTooltip>
            <div className="comment-content">
                <div className="comment-header">
                    <DynamicTooltip type="user" id={comment.userId}>
                        <Link to={`/user/${comment.user.login}`}>{comment.user.firstName} {comment.user.lastName}</Link>
                    </DynamicTooltip>
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
