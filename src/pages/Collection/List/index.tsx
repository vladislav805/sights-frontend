import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { mdiPlusBoxMultipleOutline } from '@mdi/js';
import { IApiList } from '../../../api/types/api';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import { apiExecute } from '../../../api';
import CollectionGallery from '../../../components/CollectionGallery';
import StickyHeader from '../../../components/StickyHeader';
import useCurrentUser from '../../../hook/useCurrentUser';
import PageTitle from '../../../components/PageTitle';
import Button from '../../../components/Button';
import useApiFetch from '../../../hook/useApiFetch';
import useOffset from '../../../hook/useOffset';

type ICollectionListParams = {
    ownerId?: string;
};

type Result = {
    u: IUser;
    l: IApiList<ICollection>;
};

const PEER_PAGE = 20;

const fetcherFactory = (userId: number, offset: number) =>
    () =>
        apiExecute<Result>('const id=+A.id,u=API.users.get({userIds:id,fields:A.uf})[0];'
            + 'return{u:u,l:API.collections.get({ownerId:id,count:+A.count,offset:+A.offset,fields:A.cf})}', {
            id: userId,
            count: PEER_PAGE,
            offset,
            uf: 'photo',
            cf: 'collection_city,collection_rating',
        });

const CollectionList: React.FC = () => {
    const history = useHistory();
    const currentUser = useCurrentUser();
    const params = useParams<ICollectionListParams>();
    const offset = useOffset();

    const ownerId = Number(params.ownerId ?? currentUser?.userId);

    const fetcher = React.useMemo(() => fetcherFactory(ownerId, offset), [offset]);
    const { result } = useApiFetch<Result>(fetcher);

    const { l: collections, u: owner } = result ?? {};

    const onOffsetChange = React.useMemo(() => (newOffset: number) => {
        if ((!offset && newOffset > 0) || offset !== newOffset) {
            history.push(`/collections/${ownerId}?offset=${newOffset}`);
        }
    }, [offset]);

    return (
        <StickyHeader
            left={`Коллекции пользователя ${owner ? `@${owner.login}` : ''}`}
            right={currentUser?.userId === owner?.userId && (
                <Button
                    label="Создать"
                    icon={mdiPlusBoxMultipleOutline}
                    link="/collection/new" />
            )}>
            {owner && <PageTitle backLink={`/user/${owner.login}`}>Коллекции @{owner.login}</PageTitle>}
            <CollectionGallery
                showHeader={false}
                count={collections?.count}
                items={collections?.items}
                offset={offset}
                peerPage={PEER_PAGE}
                onOffsetChange={onOffsetChange} />
        </StickyHeader>
    );
};

export default CollectionList;
