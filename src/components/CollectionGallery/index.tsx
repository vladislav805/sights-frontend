import * as React from 'react';
import { ICollection } from '../../api/types/collection';
import Pagination from '../Pagination';
import CollectionGalleryItem from './Item';
import { IApiList } from '../../api/types/api';
import LoadingSpinner from '../LoadingSpinner';
import InfoSplash from '../InfoSplash';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import { IPluralForms, pluralize } from '../../utils';
import StickyHeader from '../StickyHeader';

type ICollectionGalleryProps = {
    requestCollections: (offset: number) => Promise<IApiList<ICollection>>;
    onCollectionListUpdated?: (offset: number) => void;
    offset?: number;
    peerPage?: number;
    showHeader?: boolean;

    count?: number;
    items?: ICollection[];
};

const collectionsPlural: IPluralForms = {
    one: 'коллекция',
    some: 'коллекции',
    many: 'коллекций',
};

const CollectionGallery: React.FC<ICollectionGalleryProps> = (props: ICollectionGalleryProps) => {
    const [offset, setOffset] = React.useState<number>(props.offset ?? 0);
    const [count, setCount] = React.useState<number>(props.count ?? -1);
    const [items, setItems] = React.useState<ICollection[]>(props.items ?? null);

    const onOffsetChange = (offset: number) => {
        setItems(null);
        setOffset(offset);
    };

    React.useEffect(() => {
        if ('items' in props) {
            return;
        }

        void props.requestCollections(offset).then(result => {
            setCount(result.count);
            setItems(result.items);
            props.onCollectionListUpdated?.(offset);
        });
    }, [offset]);

    return (
        <div className="collection-gallery">
            <StickyHeader
                left={count >= 0 ? `${count} ${pluralize(count, collectionsPlural)}` : 'Загрузка...'}
                showHeader={props.showHeader}>
                <div className="collection-gallery--items">
                    {items
                        ? (items.length
                            ? items.map(collection => (
                                <CollectionGalleryItem
                                    key={collection.collectionId}
                                    collection={collection} />
                            ))
                            : <InfoSplash
                                    icon={mdiCheckboxBlankCircleOutline}
                                    iconSize="s"
                                    title="Ничего нет" />
                        )
                        : (
                            <LoadingSpinner
                                block
                                size="l" />
                        )
                    }
                </div>
                {!('items' in props) && (
                    <div className="collection-gallery--pagination">
                        {count >= 0 && (
                            <Pagination
                                onOffsetChange={onOffsetChange}
                                offset={offset}
                                count={count}
                                by={props.peerPage ?? 50} />
                        )}
                    </div>
                )}
            </StickyHeader>
        </div>
    );
};

CollectionGallery.defaultProps = {
    showHeader: true,
};

export default CollectionGallery;
