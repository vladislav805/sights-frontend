import * as React from 'react';
import './style.scss';
import API from '../../api';
import { entriesToMap } from '../../utils';
import FeedList from '../../components/FeedList';
import { withCheckForAuthorizedUser } from '../../hoc';
import withSpinnerWrapper from '../../components/LoadingSpinner/wrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import { IFeedItem } from '../../api/types/feed';
import { IUser } from '../../api/types/user';

export type IUsableFeedItem = IFeedItem & { user: IUser };

const FeedPage: React.FC = () => {
    const [feed, setFeed] = React.useState<IUsableFeedItem[]>();

    React.useEffect(() => {
        void API.feed.get({
            count: 50,
            offset: 0,
            fields: ['photo', 'ava'],
        })
            .then(res => {
                const users = entriesToMap(res.users, 'userId');

                setFeed(res.items.map(item => ({ ...item, user: users.get(item.ownerId) }) as IUsableFeedItem));
            });
    }, []);

    return (
        <div className="feed">
            <div className="feed-head">
                <h2>Последние события Ваших подписок</h2>
            </div>
            {feed
                ? <FeedList items={feed} />
                : withSpinnerWrapper(<LoadingSpinner size="l" />)}
        </div>
    );
}

export default withCheckForAuthorizedUser(FeedPage);
