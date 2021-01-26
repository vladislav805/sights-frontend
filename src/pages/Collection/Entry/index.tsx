import * as React from 'react';
import './style.scss';
import { ICollectionExtended } from '../../../api/types/collection';
import { Link, useHistory, useParams } from 'react-router-dom';
import API, { apiExecute } from '../../../api';
import StickyHeader from '../../../components/StickyHeader';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Format, humanizeDateTime } from '../../../utils';
import { TabHost } from '../../../components/Tabs';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { CollectionEntrySightsList } from './sights';
import { CollectionEntrySightsMap } from './map';
import { ICity } from '../../../api/types/city';
import { IUser } from '../../../api/types/user';
import DynamicTooltip from '../../../components/DynamicTooltip';
import TextIconified from '../../../components/TextIconified';
import {
    mdiAccount,
    mdiClock, mdiDelete,
    mdiMapMarker,
    mdiNumeric0BoxMultipleOutline,
    mdiPencilBoxMultipleOutline,
} from '@mdi/js';
import useCurrentUser from '../../../hook/useCurrentUser';
import Button from '../../../components/Button';
import PageTitle from '../../../components/PageTitle';
import InfoSplash from '../../../components/InfoSplash';
import Comments from '../../../components/Comments';

type ICollectionEntryPageProps = never;

type ICollectionEntryMatch = {
    collectionId: string;
};

type ICollectionEntryApiResult = {
    c: ICollectionExtended;
    p?: ICity;
    o: IUser;
};

const CollectionEntryPage: React.FC<ICollectionEntryPageProps> = ( /*props: ICollectionEntryPageProps*/ ) => {
    const [collection, setCollection] = React.useState<ICollectionExtended>(null);
    const [owner, setOwner] = React.useState<IUser>();
    const [city, setCity] = React.useState<ICity>();

    const match = useParams<ICollectionEntryMatch>();
    const history = useHistory();

    const currentUser = useCurrentUser();

    React.useEffect(() => {
        void apiExecute<ICollectionEntryApiResult>('const id=+A.id,c=API.collections.getById({collectionId:id,fields:A.f}),p=c?.cityId&&API.cities.getById({cityIds:c.cityId})[0],o=API.users.get({userIds:c.ownerId,fields:A.uf})[0];return{c,p,o};', {
            id: +match.collectionId,
            f: 'photo',
            uf: 'ava',
        }).then(result => {
            setCollection(result.c);
            setOwner(result.o);
            setCity(result.p);
        });
    }, [match]);

    const onClickDelete = React.useMemo(() => {
        return () => {
            const answer = confirm('Вы уверены, что хотите удалить коллекцию?');

            if (!answer) {
                return;
            }

            void API.collections.remove({ collectionId: collection.collectionId })
                .then(() => history.replace(`/collections/${collection.ownerId}`));
        };
    }, [collection]);

    if (!collection || !owner) {
        return <LoadingSpinner block subtitle="Загрузка..." />
    }

    const isOwner = currentUser?.userId === collection.ownerId;

    return (
        <div>
            <PageTitle
                backLink={`/collections/${collection.ownerId}`}>
                Коллекция «{collection.title}» от @{owner.login}
            </PageTitle>
            <StickyHeader
                left={collection.title}
                right={isOwner && (
                    <>
                        <Button
                            label="Редактировать"
                            icon={mdiPencilBoxMultipleOutline}
                            link={`/collection/${collection.collectionId}/edit`} />
                        <Button
                            label=""
                            icon={mdiDelete}
                            onClick={onClickDelete} />
                    </>
                )}>
                <MarkdownRenderer className="collection-entry--content">
                    {collection.content}
                </MarkdownRenderer>
                {city && (
                    <TextIconified icon={mdiMapMarker}>
                        <Link to={`/search/?cityId=${city.cityId}`}>{city.name}</Link>
                    </TextIconified>
                )}
                {owner && (
                    <TextIconified icon={mdiAccount}>
                        <DynamicTooltip type="user" id={owner.userId}>
                            <Link to={`/user/${owner.login}`}>
                                {owner.firstName} {owner.lastName}
                            </Link>
                        </DynamicTooltip>
                    </TextIconified>
                )}
                <TextIconified icon={mdiClock}>
                    Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                    {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
                </TextIconified>
            </StickyHeader>
            <StickyHeader left="Достопримечательности">
                {collection.items.length > 0 ? (
                    <TabHost tabs={[
                        {
                            name: 'list',
                            title: 'Списком',
                            content: (
                                <CollectionEntrySightsList items={collection.items} />
                            ),
                        },
                        {
                            name: 'map',
                            title: 'Карта',
                            content: (
                                <CollectionEntrySightsMap items={collection.items} />
                            ),
                        }
                    ]} />
                ) : (
                    <InfoSplash
                        icon={mdiNumeric0BoxMultipleOutline}
                        iconSize="m"
                        title="Ничего нет"
                        description="В коллекцию не добавили достопримечательности" />
                )}
            </StickyHeader>
            <Comments
                type="collection"
                collectionId={collection.collectionId}
                showForm={!!currentUser} />
        </div>
    );
};

export default CollectionEntryPage;
