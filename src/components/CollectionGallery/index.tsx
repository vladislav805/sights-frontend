import * as React from 'react';
import { ICollection } from '../../api/types/collection';
import Pagination from '../Pagination';
import CollectionGalleryItem from './Item';
import LoadingSpinner from '../LoadingSpinner';
import InfoSplash from '../InfoSplash';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import { IPluralForms, pluralize } from '../../utils';
import StickyHeader from '../StickyHeader';

type ICollectionGalleryProps = {
    showHeader?: boolean;

    count?: number;
    items?: ICollection[];

    peerPage?: number;
    offset?: number;
    onOffsetChange?: (offset: number) => void;
};

const collectionsPlural: IPluralForms = {
    one: 'коллекция',
    some: 'коллекции',
    many: 'коллекций',
};

const CollectionGallery: React.FC<ICollectionGalleryProps> = (props: ICollectionGalleryProps) => {
    const { count = -1, items = null } = props;

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
                {props.peerPage && (
                    <div className="collection-gallery--pagination">
                        {count >= 0 && (
                            <Pagination
                                onOffsetChange={props.onOffsetChange}
                                offset={props.offset}
                                count={count}
                                by={props.peerPage} />
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
