import * as React from 'react';
import './style.scss';
import { ICollectionExtended } from '../../../api/types/collection';
import { Link, useParams } from 'react-router-dom';
import { apiExecute } from '../../../api';
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
import { mdiAccount, mdiClock, mdiMapMarker } from '@mdi/js';
import useCurrentUser from '../../../hook/useCurrentUser';
import Button from '../../../components/Button';

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

    const currentUser = useCurrentUser();

    React.useEffect(() => {
        void apiExecute<ICollectionEntryApiResult>('const id=+A.id,c=API.collections.getById({collectionId:id,fields:A.f}),p=c?.cityId&&API.cities.getById({cityIds:c.cityId})[0],o=API.users.get({userIds:c.ownerId,fields:A.uf})[0];return{c,p,o};', {
            id: +match.collectionId,
            f: 'photo',
            uf: 'ava',
        }).then(result => {
            setCollection(result.c);
            setCity(result.p);
            setOwner(result.o);
        });
    }, [match]);

    if (!collection) {
        return <LoadingSpinner block subtitle="Загрузка..." />
    }

    const isOwner = currentUser?.userId === collection.ownerId;

    return (
        <div>
            <StickyHeader
                left={collection.title}
                right={isOwner && (
                    <Button
                        label="Редактировать"
                        size="s"
                        link={`/collection/${collection.collectionId}/edit`} />
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
            </StickyHeader>
        </div>
    );
};

export default CollectionEntryPage;
