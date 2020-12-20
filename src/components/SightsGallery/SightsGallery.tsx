import * as React from 'react';
import './style.scss';
import { ISight } from '../../api';
import { IPluralForms, pluralize } from '../../utils';
import SightGridItem from './SightGridItem';
import SightListItem from './SightListItem';
import Button from '../Button';
import classNames from 'classnames';
import ViewSwitcher from './ViewSwitcher';

type ISightsGalleryProps = {
    count: number;
    items: ISight[];
    defaultView?: SightsGalleryView;
    next?(): void;
    whenNothing?(): React.ReactNode;
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
    const [view, setView] = React.useState<SightsGalleryView>(props.defaultView);
    const [busy, setBusy] = React.useState<boolean>(false);

    const { count, items } = props;

    React.useEffect(() => {
        busy && setBusy(false);
    }, [count, items]);

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

    const onNext = (): void => {
        setBusy(true);
        props.next();
    };

    return (
        <div className={classNames('sight-gallery', {
            'sight-gallery__grid': view === SightsGalleryView.GRID,
            'sight-gallery__list': view === SightsGalleryView.LIST,
            'sight-gallery__empty': items.length === 0,
        })}>
            <div className="sight-gallery--head">
                <h3>{count} {pluralize(count, places)}</h3>
                <ViewSwitcher
                    className="sight-gallery--head-switch"
                    active={view}
                    onViewChange={setView} />
            </div>
            <div className="sight-gallery--items">
                {items.length ? items.map(renderItem) : props.whenNothing?.()}
            </div>
            <div className="sight-gallery--footer">
                {items.length < count && (
                    <Button
                        label="Далее"
                        loading={busy}
                        type="button"
                        color="primary"
                        onClick={onNext} />
                )}
            </div>
        </div>
    );
}

SightsGallery.defaultProps = {
    defaultView: SightsGalleryView.GRID,
};

export default SightsGallery;
