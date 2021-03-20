import * as React from 'react';
import './style.scss';
import classNames from 'classnames';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import { IPluralForms, pluralize } from '../../utils/pluralize';
import SightGridItem from './SightGridItem';
import SightListItem from './SightListItem';
import ViewSwitcher from './ViewSwitcher';
import { ISight } from '../../api/types/sight';
import InfoSplash from '../InfoSplash';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';
import StickyHeader from '../StickyHeader';
import { SightGalleryView } from './common';

type ISightGalleryProps = {
    defaultView?: SightGalleryView; // = grid
    count: number; // = -1
    items: ISight[]; // = null

    peerPage?: number; // = null, не показываем пагинацию
    offset?: number; // = 0
    onOffsetChange?: (offset: number) => void;
};

const places: IPluralForms = {
    none: 'мест',
    one: 'место',
    some: 'места',
    many: 'мест',
};

type ISightItemRenderProps = {
    key: number;
    sight: ISight;
};

const type: Record<SightGalleryView, React.FC<ISightItemRenderProps>> = {
    [SightGalleryView.LIST]: SightListItem,
    [SightGalleryView.GRID]: SightGridItem,
};

const SightGallery: React.FC<ISightGalleryProps> = ({
    count = -1,
    items = null,
    defaultView = SightGalleryView.GRID,
    offset = 0,
    peerPage,
    onOffsetChange,
}: ISightGalleryProps) => {
    const [view, setView] = React.useState<SightGalleryView>(defaultView);

    const renderItem = React.useCallback(
        (sight: ISight) => React.createElement(type[view], { key: sight.sightId, sight }),
        [],
    );

    const content = items && items.length > 0
        ? items.map(renderItem)
        : count === 0 && (
            <InfoSplash
                icon={mdiCheckboxBlankCircleOutline}
                iconSize="s"
                title="Ничего нет" />
        );

    return (
        <div className={classNames('sight-gallery', {
            'sight-gallery__grid': view === SightGalleryView.GRID,
            'sight-gallery__list': view === SightGalleryView.LIST,
            'sight-gallery__empty': items?.length === 0,
        })}>
            <StickyHeader
                left={count >= 0 ? `${count} ${pluralize(count, places)}` : 'Загрузка...'}
                right={(
                    <ViewSwitcher
                        className="sight-gallery--head-switch"
                        active={view}
                        onViewChange={setView} />
                )}>
                {content && <div className="sight-gallery--items">{content}</div>}
                {!content && <LoadingSpinner block size="l" />}
                {peerPage && (
                    <div className="sight-gallery--footer">
                        <Pagination
                            offset={offset}
                            count={count}
                            by={peerPage}
                            onOffsetChange={onOffsetChange} />
                    </div>
                )}
            </StickyHeader>
        </div>
    );
};

export { SightGalleryView } from './common';
export default SightGallery;
