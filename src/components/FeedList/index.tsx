import * as React from 'react';
import FeedItem from '../FeedItem';
import { IUsableFeedItem } from '../../pages/Feed';

interface IFeedListProps {
    items: IUsableFeedItem[];
}

const FeedList: React.FC<IFeedListProps> = ({ items }: IFeedListProps) => (
    <div className='feed-list'>
        {items.map(item => (
            <FeedItem
                key={item.date}
                item={item} />
        ))}
    </div>
);

export default FeedList;
