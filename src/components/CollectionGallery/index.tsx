import * as React from 'react';
import { ICollection } from '../../api/types/collection';
import Pagination from '../Pagination';
import CollectionGalleryItem from './Item';
import { IApiList } from '../../api/types/api';
import LoadingSpinner from '../LoadingSpinner';
import InfoSplash from '../InfoSplash';
import { mdiEmoticonSadOutline } from '@mdi/js';

type ICollectionGalleryProps = {
    requestCollections: (offset: number) => Promise<IApiList<ICollection>>;
    onCollectionListUpdated?: (offset: number) => void;
    offset?: number;
    peerPage?: number;
};

const CollectionGallery: React.FC<ICollectionGalleryProps> = (props: ICollectionGalleryProps) => {
    const [offset, setOffset] = React.useState<number>(props.offset ?? 0);
    const [count, setCount] = React.useState<number>(-1);
    const [items, setItems] = React.useState<ICollection[]>(null);

    const onOffsetChange = (offset: number) => {
        setItems(null);
        setOffset(offset);
    };

    React.useEffect(() => {
        void props.requestCollections(offset).then(result => {
            setCount(result.count);
            setItems(result.items);
            props.onCollectionListUpdated?.(offset);
        });
    }, [offset]);

    return (
        <div className="collection-gallery">
            <div className="collection-gallery--items">
                {items
                    ? (items.length
                        ? items.map(collection => (
                            <CollectionGalleryItem
                                key={collection.collectionId}
                                collection={collection} />
                        ))
                        : <InfoSplash
                            icon={mdiEmoticonSadOutline}
                            iconSize="s"
                            description="Ничего нет" /> // пробрасывать текст из компонента выше
                    )
                    : (
                        <LoadingSpinner
                            block
                            size="l" />
                    )
                }
            </div>
            <div className="collection-gallery--pagination">
                {count >= 0 && (
                    <Pagination
                        onOffsetChange={onOffsetChange}
                        offset={offset}
                        count={count}
                        by={props.peerPage ?? 50} />
                )}
            </div>
        </div>
    );
};

export default CollectionGallery;
