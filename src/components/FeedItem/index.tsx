import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Format, humanizeDateTime } from '../../utils/date';
import { IFeedBaseProps, renderers } from './common';
import DynamicTooltip from '../DynamicTooltip';

const FeedItem: React.FC<IFeedBaseProps> = (props: IFeedBaseProps) => {
    const { item, users } = props;

    const user = users.get(item.actorId);

    const { header, content } = renderers[item.type](props, user);

    return (
        <div className="feed-item">
            <div className="feed-item--header">
                <Link to={`/user/${user.login}`} className="feed-item--header-photo">
                    <img
                        src={user.photo.photo200}
                        alt={`Фото пользователя ${user.login}`} />
                </Link>
                <div className="feed-item--header-content">
                    <div className="feed-item--header-info">
                        <DynamicTooltip type="user" id={user.userId}>
                            <Link to={`/user/${user.login}`}>{user.firstName} {user.lastName}</Link>
                        </DynamicTooltip>
                        {' '}{header}
                    </div>
                    <div className="feed-item--header-date">{humanizeDateTime(item.date, Format.FULL)}</div>
                </div>
            </div>
            <div className={classNames("feed-item--content", `feed-item--content__${item.type}`)}>
                {content}
            </div>
        </div>
    );
};

export default FeedItem;
