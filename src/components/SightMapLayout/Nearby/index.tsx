import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiArrowRightBox } from '@mdi/js';
import Config from '../../../config';
import { humanizeDistance } from '../../../utils/distance';
import StickyHeader from '../../StickyHeader';
import { IUsableSightWithDistance } from '../../../api/local-types';

type INearbyItemProps = {
    sight: IUsableSightWithDistance;
};

const NearbyItem = ({ sight: { sightId, title, distance, photo } }: INearbyItemProps) => (
    <div className="near-item">
        <img
            className="near-item--photo"
            src={photo?.photo200 ?? Config.DEFAULT_SIGHT_PHOTO}
            alt="Thumbnail" />
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

type INearbyProps = {
    items: IUsableSightWithDistance[];
};

const Nearby: React.FC<INearbyProps> = ({ items }: INearbyProps) => (
    <StickyHeader
        showHeader
        left="Места рядом"
        right="до 1.5 км"
        collapsable
        defaultCollapsed>
        {items.map(item => (<NearbyItem key={item.sightId} sight={item} />))}
    </StickyHeader>
);

export default Nearby;
