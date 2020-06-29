import * as React from 'react';
import './style.scss';
import { IUsableSightWithDistance } from '../../../api';
import Config from '../../../config';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiArrowRightBox } from '@mdi/js';
import { humanizeDistance } from '../../../utils';
import StickyHeader from '../../StickyHeader';

interface INearbyProps {
    items: IUsableSightWithDistance[];
}

const Nearby: React.FC<INearbyProps> = ({ items }: INearbyProps) => {
    return (
        <StickyHeader
            showHeader
            left="Места рядом"
            right="до 1.5 км"
            collapsable
            defaultCollapsed={true}>
            {items.map(item => (<NearbyItem key={item.sightId} sight={item} />))}
        </StickyHeader>
    );
};

interface INearbyItemProps {
    sight: IUsableSightWithDistance;
}

const NearbyItem = ({ sight: { sightId, title, distance, photo } }: INearbyItemProps) => (
    <div className="near-item">
        <img
            className="near-item--photo"
            src={photo?.photo200 ?? Config.DEFAULT_SIGHT_PHOTO}
            alt="Photo" />
        <div className="near-item--content">
            <h4>{title}</h4>
            <div className="near-item--content-distance">{humanizeDistance(distance, true)}</div>
        </div>
        <Link
            className="near-item--goto"
            to={`/sight/${sightId}`}>
            <Icon path={mdiArrowRightBox} />
        </Link>
    </div>
);

export default Nearby;
