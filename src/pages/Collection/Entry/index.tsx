import * as React from 'react';
import './style.scss';
import 'react-image-lightbox/style.css';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    mdiAccount,
    mdiAlertCircleCheckOutline,
    mdiClock,
    mdiDelete,
    mdiMapMarker,
    mdiNumeric0BoxMultipleOutline,
    mdiPencilBoxMultipleOutline,
} from '@mdi/js';
import { ICollectionExtended } from '../../../api/types/collection';
import API, { apiExecute } from '../../../api';
import StickyHeader from '../../../components/StickyHeader';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { Format, humanizeDateTime } from '../../../utils/date';
import { TabHost } from '../../../components/Tabs';
import MarkdownRenderer from '../../../components/MarkdownRenderer';
import { CollectionEntrySightsList } from './sights';
import { CollectionEntrySightsMap } from './map';
import { IUser } from '../../../api/types/user';
import DynamicTooltip from '../../../components/DynamicTooltip';
import TextIconified from '../../../components/TextIconified';
import useCurrentUser from '../../../hook/useCurrentUser';
import Button from '../../../components/Button';
import PageTitle from '../../../components/PageTitle';
import InfoSplash from '../../../components/InfoSplash';
import Comments from '../../../components/Comments';
import SharePanel from '../../../components/SharePanel';
import StarRating from '../../../components/StarRating';
import { IPhoto } from '../../../api/types/photo';
import { PhotoViewer } from './photo-viewer';
import { CollectionEntryRoute } from './route';

type ICollectionEntryPageProps = never;

type ICollectionEntryMatch = {
    collectionId: string;
};

type ICollectionEntryApiResult = {
    c: ICollectionExtended;
    o: IUser;
    m: IPhoto[];
};

type TabName = 'list' | 'map' | 'route';

const CollectionEntryPage: React.FC<ICollectionEntryPageProps> = (/* props: ICollectionEntryPageProps */) => {
    const [collection, setCollection] = React.useState<ICollectionExtended>(null);
    const [owner, setOwner] = React.useState<IUser>();
    const [photosMap, setPhotosMap] = React.useState<Map<number, IPhoto>>(new Map());
    const [photos, setPhotos] = React.useState<IPhoto[]>();
    const [currentPhoto, setCurrentPhoto] = React.useState<number>(-1);

    const [tab, setTab] = React.useState<TabName>('list');

    const match = useParams<ICollectionEntryMatch>();
    const history = useHistory();

    const currentUser = useCurrentUser();

    React.useEffect(() => {
        apiExecute<ICollectionEntryApiResult>('const id=+A.id,c=API.collections.getById({collectionId:id,fields:A.csf}),'
            + 'o=API.users.get({userIds:c.ownerId,fields:A.uf})[0],m=API.internal.parseMarkdownForObjects({text:c.content});'
            + 'return{c,o,m:API.photos.getById({photoIds:m.photoIds})};', {
            id: +match.collectionId,
            csf: 'photo,collection_city,collection_rating',
            uf: 'ava',
        }).then(result => {
            setCollection(result.c);
            setOwner(result.o);

            const media = result.m.reduce((map, photo) => map.set(photo.photoId, photo), new Map<number, IPhoto>());
            setPhotosMap(media);
            setPhotos(result.m);
        });
    }, [match]);

    const onClickDelete = React.useMemo(() => () => {
        const answer = window.confirm('Вы уверены, что хотите удалить коллекцию?');

        if (!answer) {
            return;
        }

        API.collections.remove({ collectionId: collection.collectionId })
            .then(() => history.replace(`/collections/${collection.ownerId}`));
    }, [collection]);

    const onRatingChanged = React.useMemo(() =>
        (rating: number) =>
            API.rating.set({ collectionId: collection.collectionId, rating })
                .then(rating => setCollection({
                    ...collection,
                    rating,
                })), [collection]);

    const onPhotoClick = (photoId: number) => setCurrentPhoto(photos.findIndex(photo => photo.photoId === photoId));

    const tabContent = React.useMemo(() => collection && ({
        list: () => <CollectionEntrySightsList items={collection.items} />,
        map: () => <CollectionEntrySightsMap items={collection.items} />,
        route: () => <CollectionEntryRoute items={collection.items} collection={collection} />,
    })[tab]?.(), [tab, collection]);

    if (!collection || !owner) {
        return <LoadingSpinner block subtitle="Загрузка..." />;
    }

    const isUsualCollection = !collection.isSystem;

    return (
        <div>
            <PageTitle
                backLink={`/collections/${collection.ownerId}`}>
                Коллекция «{collection.title}» от @{owner.login}
            </PageTitle>
            <StickyHeader
                left={collection.title}
                right={collection.type !== 'DRAFT' && (
                    <SharePanel
                        text={`Коллекция «${collection.title}»`}
                        link={`/collection/${collection.collectionId}`} />
                )}>
                <MarkdownRenderer
                    className="collection-entry--content"
                    photos={photosMap}
                    onClickPhoto={onPhotoClick}>
                    {collection.content}
                </MarkdownRenderer>
                {collection.city && (
                    <TextIconified icon={mdiMapMarker}>
                        <Link to={`/search/collections?cityId=${collection.city.cityId}`}>{collection.city.name}</Link>
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
                {isUsualCollection && (
                    <>
                        <TextIconified icon={mdiClock}>
                            Создано {humanizeDateTime(collection.dateCreated, Format.FULL)}
                            {collection.dateUpdated > 0 && `, обновлено ${humanizeDateTime(collection.dateUpdated, Format.FULL)}`}
                        </TextIconified>
                        <div className="collection-entry--rating">
                            <StarRating
                                enabled={!!currentUser}
                                value={collection.rating.value}
                                count={collection.rating.count}
                                rated={collection.rating.rated}
                                onRatingChange={onRatingChanged} />
                        </div>
                        <div className="collection-entry--actions">
                            {collection.ownerId === currentUser?.userId ? (
                                <>
                                    <Button
                                        label="Редактировать"
                                        icon={mdiPencilBoxMultipleOutline}
                                        link={`/collection/${collection.collectionId}/edit`} />
                                    <Button
                                        label="Удалить"
                                        icon={mdiDelete}
                                        onClick={onClickDelete} />
                                </>
                            ) : (
                                <>
                                    <Button
                                        label="Пожаловаться"
                                        disabled
                                        icon={mdiAlertCircleCheckOutline} />
                                </>
                            )}
                        </div>
                    </>
                )}
            </StickyHeader>
            <StickyHeader left="Достопримечательности">
                {collection.items.length > 0 ? (
                    <TabHost
                        onTabChanged={(tab: string) => setTab(tab as TabName)}
                        tabs={[{
                            name: 'list',
                            title: 'Списком',
                        }, {
                            name: 'map',
                            title: 'Карта',
                        }, {
                            name: 'route',
                            title: 'Путь',
                        }]}>
                        {tabContent}
                    </TabHost>
                ) : (
                    <InfoSplash
                        icon={mdiNumeric0BoxMultipleOutline}
                        iconSize="s"
                        description="В коллекцию не добавили достопримечательности" />
                )}
            </StickyHeader>
            {isUsualCollection && (
                <>
                    <Comments
                        type="collection"
                        collectionId={collection.collectionId}
                        showForm={!!currentUser} />
                    <PhotoViewer
                        photos={photos}
                        current={currentPhoto}
                        onClickPhoto={index => setCurrentPhoto(index)} />
                </>
            )}
        </div>
    );
};

export default CollectionEntryPage;
