import * as React from 'react';
import './style.scss';
import { IUsableSightWithDistance } from '../../../api';
import Config from '../../../config';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiArrowRightBox } from '@mdi/js';

interface INearbyProps {
    items: IUsableSightWithDistance[];
}

const Nearby = ({ items }: INearbyProps) => (
    <div className="nearby">
        <h4>Неподалёку отсюда (до 1.5 км)</h4>
        <div className="nearby-list">
            {items.map(item => (<NearbyItem key={item.sightId} sight={item} />))}
        </div>
    </div>
);

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
            <strong>{title}</strong>
            <div className="near-item--content-distance">{distance} м</div>
        </div>
        <Link
            className="near-item--goto"
            to={`/sight/${sightId}`}>
            <Icon path={mdiArrowRightBox} />
        </Link>
    </div>
);

export default Nearby;
