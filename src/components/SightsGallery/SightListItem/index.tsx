import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckDecagram } from '@mdi/js';
import { ISightGalleryItem } from '../common';
import { Format, humanizeDateTime } from '../../../utils/date';
import Config from '../../../config';

const SightListItem: React.FC<ISightGalleryItem> = ({ sight }: ISightGalleryItem) => (
    <div className="sight-gallery__list--item">
        <img
            className="sight-gallery__list--item--photo"
            src={sight.photo?.photo200 ?? Config.DEFAULT_SIGHT_PHOTO}
            alt="Thumbnail" />
        <div className="sight-gallery__list--item--content">
            <h4>
                <Link to={`/sight/${sight.sightId}`}>{sight.title}</Link>
                {(sight.mask & 2) === 2 && (<Icon path={mdiCheckDecagram} size={1} />)}
            </h4>
            <p>{sight.description}</p>
            <p>Добавлено: {humanizeDateTime(new Date(sight.dateCreated * 1000), Format.DATE)}</p>
        </div>
    </div>
);

export default SightListItem;
