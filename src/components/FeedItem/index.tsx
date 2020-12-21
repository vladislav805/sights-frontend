import * as React from 'react';
import './style.scss';
import { IUser } from '../../api';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { IUsableFeedItem } from '../../pages/Feed';
import { Format, genderize, humanizeDateTime } from '../../utils';
import { SightFeedItem } from './Sight';
import { PhotoFeedItem } from './Photo';

type IFeedItemProps = {
    item: IUsableFeedItem;
}

type IFeedAction = (user: IUser) => string;

const events: Record<'photo' | 'sight', IFeedAction> = {
    sight: user => `${genderize(user, 'добавил', 'добавила')} новую достопримечательность`,
    photo: user => `${genderize(user, 'загрузил', 'загрузила')} фотографию`,
};

const FeedItem: React.FC<IFeedItemProps> = ({ item }: IFeedItemProps) => {
    const { user, date } = item;

    return (
        <div className="feed-item">
            <div className="feed-item--header">
                <Link to={`/user/${user.login}`} className="feed-item--header-photo">
                    <img
                        src={user.photo.photo200}
                        alt={`Фото пользователя ${user.login}`} />
                </Link>
                <div className="feed-item--header-content">
                    <div>
                        <strong><Link to={`/user/${user.login}`}>{user.firstName} {user.lastName}</Link></strong>
                        {' '}{events[item.type](user)}
                    </div>
                    <div className="feed-item--header-date">{humanizeDateTime(date, Format.FULL)}</div>
                </div>
            </div>
            <div className={classNames("feed-item--content", `feed-item--content__${item.type}`)}>
                {item.type === 'sight' && <SightFeedItem sight={item.sight} />}
                {item.type === 'photo' && <PhotoFeedItem sight={item.sight} photo={item.photo} />}
            </div>
        </div>
    );
};

export default FeedItem;
