import * as React from 'react';
import './style.scss';
import { IUsableSightWithDistance } from '../../../api';
import Config from '../../../config';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiArrowRightBox } from '@mdi/js';
import classNames from 'classnames';

interface INearbyProps {
    items: IUsableSightWithDistance[];
}

const Nearby = ({ items }: INearbyProps) => {
    const [open, setOpen] = React.useState(false);
    const toggleOpen = () => setOpen(!open);
    return (
        <div className={classNames('near', {
            'near__open': open,
        })}>
            <h3 onClick={toggleOpen}>Неподалёку отсюда (до 1.5 км)</h3>
            <div className="near-list">
                {items.map(item => (<NearbyItem key={item.sightId} sight={item} />))}
            </div>
        </div>
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
