import * as React from 'react';
import './style.scss';
import { useHistory } from 'react-router-dom';
import API from '../../api';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import FeedItem from '../../components/FeedItem';
import useCurrentUser from '../../hook/useCurrentUser';
import useApiFetch from '../../hook/useApiFetch';
import { entriesToMap } from '../../utils/entriesToMap';

const fetcher = () => API.feed.get({
    count: 50,
    offset: 0,
    fields: ['photo', 'ava'],
})
    .then(res => {
        const users = entriesToMap(res.users, 'userId');
        const sights = entriesToMap(res.sights, 'sightId');
        const collections = entriesToMap(res.collections, 'collectionId');
        const photos = entriesToMap(res.photos, 'photoId');
        const comments = entriesToMap(res.comments, 'commentId');

        return { items: res.items, users, sights, collections, photos, comments };
    });

const FeedPage: React.FC = () => {
    const currentUser = useCurrentUser();
    const history = useHistory();

    const { result } = useApiFetch(fetcher);

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
            {result
                ? (
                    <div className="feed-list">
                        {result.items.map(item => (
                            <FeedItem
                                key={item.date}
                                item={item}
                                users={result.users}
                                sights={result.sights}
                                collections={result.collections}
                                photos={result.photos}
                                comments={result.comments} />
                        ))}
                    </div>
                )
                : (
                    <LoadingSpinner
                        block
                        subtitle="Получение новостей..."
                        size="l" />
                )}
        </div>
    );
};

export default FeedPage;
