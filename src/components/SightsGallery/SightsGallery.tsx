import * as React from 'react';
import './style.scss';
import { ISight, List } from '../../api';
import { IPluralForms, pluralize } from '../../utils';
import SightGridItem from './SightGridItem';
import SightListItem from './SightListItem';
import Button from '../Button';
import classNames from 'classnames';
import ViewSwitcher from './ViewSwitcher';

interface ISightsGalleryProps {
    data: List<ISight>;
    next?: () => void;
    defaultView?: SightsGalleryView;
    whenNothing?: () => React.ReactChild;
}

interface ISightsGalleryState {
    view: SightsGalleryView;
    busy?: boolean;
}

export interface ISightGalleryItem {
    sight: ISight;
}

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

class SightsGallery extends React.Component<ISightsGalleryProps, ISightsGalleryState> {
    static defaultProps = {
        defaultView: SightsGalleryView.GRID,
    };

    constructor(props: ISightsGalleryProps) {
        super(props);

        this.state = {
            view: props.defaultView,
        };
    }

    componentDidUpdate(prevProps: Readonly<ISightsGalleryProps>): void {
        if (this.state.busy && this.props.data.items !== prevProps.data.items) {
            this.setState({ busy: false });
        }
    }

    private renderItem = (item: ISight) => {
        switch (this.state.view) {
            case SightsGalleryView.GRID: {
                return <SightGridItem key={item.sightId} sight={item} />;
            }

            case SightsGalleryView.LIST: {
                return <SightListItem key={item.sightId} sight={item} />;
            }
        }
    };

    private onViewChange = (view: SightsGalleryView) => this.setState({ view });

    private onNext = () => this.setState({ busy: true }, this.props.next);

    render(): JSX.Element {
        const { data: { count, items }, whenNothing } = this.props;
        const { view } = this.state;
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
                        active={this.state.view}
                        onViewChange={this.onViewChange} />
                </div>
                <div className="sight-gallery--items">
                    {items.length ? items.map(this.renderItem) : whenNothing?.()}
                </div>
                <div className="sight-gallery--footer">
                    {items.length < count && (
                        <Button
                            label="Далее"
                            loading={this.state.busy}
                            type="button"
                            color="primary"
                            onClick={this.onNext} />
                    )}
                </div>
            </div>
        );
    }
}

export default SightsGallery;
