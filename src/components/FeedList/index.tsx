import * as React from 'react';
import './style.scss';
import { IUsableEvent } from '../../api';
import FeedItem from '../FeedItem';

interface IFeedListProps {
    items: IUsableEvent[];
}

const FeedList: React.FC<IFeedListProps> = ({ items }: IFeedListProps) => {
    return (
        <div className="feed-list">
            {items.map(item => (
                <FeedItem key={item.eventId} item={item} />
            ))}
        </div>
    );
};

export default FeedList;
