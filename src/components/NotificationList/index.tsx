import * as React from 'react';
import { IUsableEvent } from '../../api';
import FeedItem from '../NotificationItem';

interface IFeedListProps {
    items: IUsableEvent[];
}

const FeedList: React.FC<IFeedListProps> = ({ items }: IFeedListProps) => (
    <div className='feed-list'>
        {items.map(item => (
            <FeedItem
                key={item.eventId}
                item={item} />
        ))}
    </div>
);

export default FeedList;
