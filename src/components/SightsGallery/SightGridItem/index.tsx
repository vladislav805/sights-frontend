import * as React from 'react';
import './style.scss';
import { ISightGalleryItem } from '../SightsGallery';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiCheckDecagram } from '@mdi/js';
import Config from '../../../config';

const SightGridItem = ({ sight }: ISightGalleryItem) => (
    <div className="sight-gallery__grid--item-wrap">
        <Link
            to={`/sight/${sight.sightId}`}
            className="sight-gallery__grid--item"
            title={sight.title}>
            <img
                className="sight-gallery__grid--item--photo"
                src={sight.photo?.photo200 ?? Config.DEFAULT_SIGHT_PHOTO}
                alt="Thumbnail" />
            <div className="sight-gallery__grid--item--icons">
                {sight.isVerified && (<Icon path={mdiCheckDecagram} size={1} />)}
            </div>
            <div className="sight-gallery__grid--item--content">
                <h4>{sight.title}</h4>
            </div>
        </Link>
    </div>
);

export default SightGridItem;
