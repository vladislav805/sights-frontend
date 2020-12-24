import * as React from 'react';
import FeedItem from '../NotificationItem';
import { INotification } from '../../api/types/notification';

interface IFeedListProps {
    items: INotification[];
}

const FeedList: React.FC<IFeedListProps> = ({ items }: IFeedListProps) => (
    <div className='feed-list'>
        {/*items.map(item => (
            <FeedItem
                key={item.eventId}
                item={item} />
        ))*/}
    </div>
);

export default FeedList;
