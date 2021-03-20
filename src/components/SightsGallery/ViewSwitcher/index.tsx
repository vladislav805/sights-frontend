import * as React from 'react';
import './style.scss';
import Icon from '@mdi/react';
import { mdiFormatListText, mdiViewDashboard } from '@mdi/js';
import classNames from 'classnames';
import { SightGalleryView } from '../common';

type IViewSwitcherProps = {
    className?: string;
    active: SightGalleryView;
    onViewChange(view: SightGalleryView): void;
};

type ViewItem = {
    name: SightGalleryView;
    icon: string;
    label: string;
};

const variants: ViewItem[] = [
    {
        name: SightGalleryView.GRID,
        icon: mdiViewDashboard,
        label: 'grid',
    },
    {
        name: SightGalleryView.LIST,
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
