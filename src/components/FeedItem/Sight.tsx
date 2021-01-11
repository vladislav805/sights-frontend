import * as React from 'react';
import { getStaticMapImageUri } from '../../utils/getStaticMapImageUri';
import { ISight } from '../../api/types/sight';
import { Link } from 'react-router-dom';

type ISightFeedItem = {
    sight: ISight;
};

export const SightFeedItem: React.FC<ISightFeedItem> = ({ sight }: ISightFeedItem) => (
    <>
        <h4><Link to={`/sight/${sight.sightId}`}>{sight.title}</Link></h4>
        <p>{sight.description}</p>
        <img
            src={getStaticMapImageUri({
                width: 300,
                height: 200,
                lat: sight.latitude,
                lng: sight.longitude,
                zoom: 13,
                x2: true,
                marker: true,
            })}
            alt="Карта"
            className="feed-item--content__sight-map" />
    </>
);
