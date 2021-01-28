import * as React from 'react';
import './style.scss';
import { IPluralForms, pluralize } from '../../utils';
import SightGridItem from './SightGridItem';
import SightListItem from './SightListItem';
import classNames from 'classnames';
import ViewSwitcher from './ViewSwitcher';
import { ISight } from '../../api/types/sight';
import { IApiList } from '../../api/types/api';
import InfoSplash from '../InfoSplash';
import { mdiCheckboxBlankCircleOutline } from '@mdi/js';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from '../Pagination';

type ISightsGalleryProps = {
    defaultView?: SightsGalleryView;
} & (ISightsGalleryOnlineProps & ISightsGalleryOfflineProps);

type ISightsGalleryOnlineProps = {
    requestSights?: (offset: number) => Promise<IApiList<ISight>>;
    onSightListUpdated?: (offset: number) => void;
    offset?: number;
    peerPage?: number;
};

type ISightsGalleryOfflineProps = {
    count?: number;
    items?: ISight[];
};

export type ISightGalleryItem = {
    sight: ISight;
};

export const enum SightsGalleryView {
    GRID,
    LIST,
}

const places: IPluralForms = {
    none: 'мест',
    one: 'место',
    some: 'места',
    many: 'мест',
};

const SightsGallery: React.FC<ISightsGalleryProps> = (props: ISightsGalleryProps) => {
    const [offset, setOffset] = React.useState<number>(props.offset ?? 0);
    const [view, setView] = React.useState<SightsGalleryView>(props.defaultView);

    const [count, setCount] = React.useState<number>(props.count ?? -1);
    const [items, setItems] = React.useState<ISight[]>(props.items);

    React.useEffect(() => {
        void props.requestSights?.(offset).then(result => {
            setItems(result.items);
            setCount(result.count);
            props.onSightListUpdated?.(offset);
        });
    }, [offset]);

    const renderItem = (item: ISight) => {
        switch (view) {
            case SightsGalleryView.GRID: {
                return <SightGridItem key={item.sightId} sight={item} />;
            }

            case SightsGalleryView.LIST: {
                return <SightListItem key={item.sightId} sight={item} />;
            }
        }
    };

    const head = count >= 0 ? (
        <>
            <h3>{count} {pluralize(count, places)}</h3>
            <ViewSwitcher
                className="sight-gallery--head-switch"
                active={view}
                onViewChange={setView} />
        </>
    ) : (
        <>
            <h3>Загрузка...</h3>
        </>
    );

    const content = items && items.length > 0
        ? items.map(renderItem)
        : count === 0 && (
            <InfoSplash
                icon={mdiCheckboxBlankCircleOutline}
                iconSize="m"
                title="Ничего нет" />
        );

    return (
        <div className={classNames('sight-gallery', {
            'sight-gallery__grid': view === SightsGalleryView.GRID,
            'sight-gallery__list': view === SightsGalleryView.LIST,
            'sight-gallery__empty': items?.length === 0,
        })}>
            <div className="sight-gallery--head">{head}</div>
            {content && <div className="sight-gallery--items">{content}</div>}
            {!content && <LoadingSpinner block size="l" />}
            <div className="sight-gallery--footer">
                <Pagination
                    offset={offset}
                    count={count}
                    by={props.peerPage}
                    onOffsetChange={setOffset} />
            </div>
        </div>
    );
}

SightsGallery.defaultProps = {
    defaultView: SightsGalleryView.GRID,
};

export default SightsGallery;
