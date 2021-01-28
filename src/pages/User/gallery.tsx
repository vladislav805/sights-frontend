import * as React from 'react';
import { IUser } from '../../api/types/user';
import { TabHost } from '../../components/Tabs';
import SightsGallery from '../../components/SightsGallery/SightsGallery';
import CollectionGallery from '../../components/CollectionGallery';
import API from '../../api';

type IProfileGalleryProps = {
    user: IUser;
};

const SIGHT_PEER_PAGE = 30;
const COLLECTION_PEER_PAGE = 20;

export const ProfileGallery: React.FC<IProfileGalleryProps> = (props: IProfileGalleryProps) => {
    const sightsRequest = React.useMemo(() => {
        return (offset: number) => API.sights.getByUser({
            ownerId: props.user.userId,
            count: SIGHT_PEER_PAGE,
            fields: ['photo'],
            offset,
        });
    }, []);

    const collectionRequest = React.useMemo(() => {
        return (offset: number) => API.collections.get({
            ownerId: props.user.userId,
            count: COLLECTION_PEER_PAGE,
            fields: ['collection_rating'],
            offset,
        });
    }, []);

    return (
        <TabHost
            tabs={[
                {
                    name: 'sights',
                    title: 'Достопримечательности',
                    content: (
                        <SightsGallery
                            requestSights={sightsRequest}
                            peerPage={SIGHT_PEER_PAGE} />
                    ),
                },

                {
                    name: 'collections',
                    title: 'Коллекции',
                    content: (
                        <CollectionGallery
                            requestCollections={collectionRequest}
                            peerPage={COLLECTION_PEER_PAGE} />
                    ),
                },
            ]} />
    );
};
