import * as React from 'react';
import './style.scss';
import { IPluralForms, pluralize } from '../../utils';
import SightGridItem from './SightGridItem';
import SightListItem from './SightListItem';
import classNames from 'classnames';
import ViewSwitcher from './ViewSwitcher';
import { ISight } from '../../api/types/sight';
import InfoSplash from '../InfoSplash';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';
import StickyHeader from '../StickyHeader';

type ISightGalleryProps = {
    defaultView?: SightGalleryView; // = grid
    count: number; // = -1
    items: ISight[]; // = null

    peerPage?: number; // = null, не показываем пагинацию
    offset?: number; // = 0
    onOffsetChange?: (offset: number) => void;
};

export type ISightGalleryItem = {
    sight: ISight;
};

export const enum SightGalleryView {
    GRID = 'grid',
    LIST = 'view',
}

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

const SightGallery: React.FC<ISightGalleryProps> = (props: ISightGalleryProps) => {
    const [view, setView] = React.useState<SightGalleryView>(props.defaultView);

    const { count = -1, items = null } = props;

    const renderItem = (sight: ISight) => React.createElement(type[view], { key: sight.sightId, sight });

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
                {props.peerPage && (
                    <div className="sight-gallery--footer">
                        <Pagination
                            offset={props.offset}
                            count={count}
                            by={props.peerPage}
                            onOffsetChange={props.onOffsetChange} />
                    </div>
                )}
            </StickyHeader>
        </div>
    );
}

SightGallery.defaultProps = {
    defaultView: SightGalleryView.GRID,
    offset: 0,
};

export default SightGallery;
