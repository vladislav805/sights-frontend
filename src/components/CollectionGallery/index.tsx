/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import { ICollection } from '../../api/types/collection';
import Pagination from '../Pagination';
import CollectionGalleryItem from './Item';
import LoadingSpinner from '../LoadingSpinner';
import InfoSplash from '../InfoSplash';
import { IPluralForms, pluralize } from '../../utils/pluralize';
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

const CollectionGallery: React.FC<ICollectionGalleryProps> = ({
    count = -1,
    items = null,
    peerPage,
    offset,
    showHeader = true,
    onOffsetChange,
}: ICollectionGalleryProps) => (
    <div className="collection-gallery">
        <StickyHeader
            left={count >= 0 ? `${count} ${pluralize(count, collectionsPlural)}` : 'Загрузка...'}
            showHeader={showHeader}>
            <div className="collection-gallery--items">
                {items
                    ? (items.length
                        ? items.map(collection => (
                            <CollectionGalleryItem
                                key={collection.collectionId}
                                collection={collection} />
                        ))
                        : (
                            <InfoSplash
                                icon={mdiCheckboxBlankCircleOutline}
                                iconSize="s"
                                title="Ничего нет" />
                        )
                    )
                    : (
                        <LoadingSpinner
                            block
                            size="l" />
                    )}
            </div>
            {peerPage && (
                <div className="collection-gallery--pagination">
                    {count >= 0 && (
                        <Pagination
                            onOffsetChange={onOffsetChange}
                            offset={offset}
                            count={count}
                            by={peerPage} />
                    )}
                </div>
            )}
        </StickyHeader>
    </div>
);

export default CollectionGallery;
