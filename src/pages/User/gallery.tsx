import * as React from 'react';
import { IUser } from '../../api/types/user';
import { TabHost } from '../../components/Tabs';
import SightGallery from '../../components/SightsGallery';
import CollectionGallery from '../../components/CollectionGallery';
import API from '../../api';
import { IApiList } from '../../api/types/api';
import { ISight } from '../../api/types/sight';
import { ICollection } from '../../api/types/collection';

type IProfileGalleryProps = {
    user: IUser;
};

const SIGHT_PEER_PAGE = 30;
const COLLECTION_PEER_PAGE = 20;

export const ProfileGallery: React.FC<IProfileGalleryProps> = (props: IProfileGalleryProps) => {
    const [sightOffset, setSightOffset] = React.useState<number>(0);
    const [sights, setSights] = React.useState<IApiList<ISight>>();

    const [collectionOffset, setCollectionOffset] = React.useState<number>(0);
    const [collections, setCollections] = React.useState<IApiList<ICollection>>();

    const [tab, setTab] = React.useState<string>('sights');

    // FIXME: при загрузке профиля это два метода отрабатывают одновременно, даже если не просили
    React.useEffect(() => {
        API.sights.getByUser({
            ownerId: props.user.userId,
            count: SIGHT_PEER_PAGE,
            fields: ['photo'],
            offset: sightOffset,
        }).then(setSights);
    }, [sightOffset]);

    React.useEffect(() => {
        API.collections.get({
            ownerId: props.user.userId,
            count: COLLECTION_PEER_PAGE,
            fields: ['collection_rating'],
            offset: collectionOffset,
        }).then(setCollections);
    }, [collectionOffset]);

    const content = React.useMemo(() => tab === 'sights'
        ? (
            <SightGallery
                count={sights?.count}
                items={sights?.items}
                offset={sightOffset}
                onOffsetChange={setSightOffset}
                peerPage={SIGHT_PEER_PAGE} />
        )
        : (
            <CollectionGallery
                count={collections?.count}
                items={collections?.items}
                offset={collectionOffset}
                onOffsetChange={setCollectionOffset}
                peerPage={COLLECTION_PEER_PAGE} />
        ), [tab, sightOffset, collectionOffset, sights, collections]);

    return (
        <TabHost
            onTabChanged={setTab}
            tabs={[{
                name: 'sights',
                title: 'Достопримечательности',
            }, {
                name: 'collections',
                title: 'Коллекции',
            }]}>
            {content}
        </TabHost>
    );
};
