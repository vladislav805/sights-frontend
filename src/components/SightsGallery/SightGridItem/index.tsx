import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckDecagram } from '@mdi/js';
import { ISightGalleryItem } from '../common';
import Config from '../../../config';

const SightGridItem: React.FC<ISightGalleryItem> = ({ sight }: ISightGalleryItem) => (
    <div className="sight-gallery__grid--item-wrap">
        <Link
            to={`/sight/${sight.sightId}`}
            className="sight-gallery__grid--item-link"
            title={sight.title}>
            <img
                className="sight-gallery__grid--item--photo"
                src={sight.photo?.photo200 ?? Config.DEFAULT_SIGHT_PHOTO}
                alt="Thumbnail" />
            <div className="sight-gallery__grid--item--icons">
                {(sight.mask & 2) === 2 && (<Icon path={mdiCheckDecagram} size={1} />)}
            </div>
            <div className="sight-gallery__grid--item--content">
                <h4>{sight.title.slice(0, 40)}</h4>
            </div>
        </Link>
    </div>
);

export default SightGridItem;
