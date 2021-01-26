import * as React from 'react';
import './style.scss';
import API from '../../api';
import { entriesToMap } from '../../utils';
import FeedList from '../../components/FeedList';
import LoadingSpinner from '../../components/LoadingSpinner';
import { IFeedItem } from '../../api/types/feed';
import { IUser } from '../../api/types/user';
import PageTitle from '../../components/PageTitle';
import useCurrentUser from '../../hook/useCurrentUser';
import { useHistory } from 'react-router-dom';

export type IUsableFeedItem = IFeedItem & { user: IUser };

const FeedPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const history = useHistory();
    const [feed, setFeed] = React.useState<IUsableFeedItem[]>();

    React.useEffect(() => {
        if (!currentUser) {
            return;
        }

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

    if (!currentUser) {
        history.replace('/');
        return null;
    }

    return (
        <div className="feed">
            <PageTitle>События</PageTitle>
            <div className="feed-head">
                <h2>Последние события Ваших подписок</h2>
            </div>
            {feed
                ? (
                    <FeedList
                        items={feed} />
                )
                : (
                    <LoadingSpinner
                        block
                        subtitle="Получение новостей..."
                        size="l" />
                )}
        </div>
    );
}

export default FeedPage;
