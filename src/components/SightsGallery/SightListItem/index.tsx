import * as React from 'react';
import './style.scss';
import { ISightGalleryItem } from '../SightsGallery';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckDecagram } from '@mdi/js';
import { Format, humanizeDateTime } from '../../../utils';

const SightListItem = ({ sight }: ISightGalleryItem) => (
    <div className="sight-gallery__list--item">
        <img
            className="sight-gallery__list--item--photo"
            src={sight.photo?.photo200}
            alt="Thumbnail" />
        <div className="sight-gallery__list--item--content">
            <h4>
                <Link to={`/sight/${sight.sightId}`}>{sight.title}</Link>
                {sight.isVerified && (<Icon path={mdiCheckDecagram} size={1} />)}
            </h4>
            <p>{sight.description}</p>
            <p>Добавлено: {humanizeDateTime(new Date(sight.dateCreated * 1000), Format.DATE)}</p>
        </div>
    </div>
);

export default SightListItem;
