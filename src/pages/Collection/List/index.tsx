import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IApiList } from '../../../api/types/api';
import { ICollection } from '../../../api/types/collection';
import { IUser } from '../../../api/types/user';
import { apiExecute } from '../../../api';
import CollectionGallery from '../../../components/CollectionGallery';
import StickyHeader from '../../../components/StickyHeader';
import useCurrentUser from '../../../hook/useCurrentUser';
import PageTitle from '../../../components/PageTitle';
import { mdiPlusBoxMultipleOutline } from '@mdi/js';
import Button from '../../../components/Button';

type ICollectionListParams = {
    ownerId?: string;
};

const CollectionList: React.FC = () => {
    const history = useHistory();
    const currentUser = useCurrentUser();
    const params = useParams<ICollectionListParams>();
    const [owner, setOwner] = React.useState<IUser>(null);

    const ownerId = Number(params.ownerId ?? currentUser?.userId);

    const requester = React.useCallback((offset: number) => {
        type Result = {
            u: IUser;
            l: IApiList<ICollection>;
        };

        return apiExecute<Result>('const id=+A.id,u=API.users.get({userIds:id,fields:"photo"})[0];return{u:u,l:API.collections.get({ownerId:id,count:+A.count,offset:+A.offset})}', {
            id: ownerId,
            count: 50,
            offset,
        }).then(result => {
            setOwner(result.u);
            return result.l;
        });
    }, []);

    const updateAddress = React.useMemo(() => (offset: number) => {
        const str = offset ? `?offset=${offset}` : '';
        history.replace(`/collections/${ownerId}${str}`);
    }, []);

    return (
        <StickyHeader
            left={`Коллекции пользователя ${owner ? `@${owner.login}` : ''}`}
            right={currentUser?.userId === owner?.userId && (
                <Button
                    label="Создать"
                    icon={mdiPlusBoxMultipleOutline}
                    link={`/collection/new`} />
            )}>
            {owner && <PageTitle backLink={`/user/${owner.login}`}>Коллекции @{owner.login}</PageTitle>}
            <CollectionGallery
                requestCollections={requester}
                onCollectionListUpdated={updateAddress} />
        </StickyHeader>
    );
};

export default CollectionList;
