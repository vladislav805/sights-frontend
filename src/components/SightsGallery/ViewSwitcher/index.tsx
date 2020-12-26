import * as React from 'react';
import './style.scss';
import { SightsGalleryView } from '../SightsGallery';
import Icon from '@mdi/react';
import { mdiFormatListText, mdiViewDashboard } from '@mdi/js';
import classNames from 'classnames';

type IViewSwitcherProps = {
    className?: string;
    active: SightsGalleryView;
    onViewChange(view: SightsGalleryView): void;
};

type ViewItem = {
    name: SightsGalleryView;
    icon: string;
    label: string;
};

const variants: ViewItem[] = [
    {
        name: SightsGalleryView.GRID,
        icon: mdiViewDashboard,
        label: 'grid',
    },
    {
        name: SightsGalleryView.LIST,
        icon: mdiFormatListText,
        label: 'list',
    },
];

const ViewSwitcher: React.FC<IViewSwitcherProps> = ({ className, active, onViewChange }: IViewSwitcherProps) => (
    <div className={classNames('view-switch', className)}>
        {variants.map(({ name, icon, label }) => (
            <div
                key={name}
                title={label}
                onClick={() => onViewChange(name)}
                className={classNames('view-switch--item', {
                    'view-switch--item__active': name === active,
                })}>
                <Icon path={icon} />
            </div>
        ))}
    </div>
);

export default ViewSwitcher;
