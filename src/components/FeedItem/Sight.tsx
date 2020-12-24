import * as React from 'react';
import { getStaticMapImageUri } from '../../utils/getStaticMapImageUri';
import { ISight } from '../../api/types/sight';

type ISightFeedItem = {
    sight: ISight;
};

export const SightFeedItem: React.FC<ISightFeedItem> = ({ sight }: ISightFeedItem) => (
    <>
        <h4>{sight.title}</h4>
        <p>{sight.description}</p>
        <img
            src={getStaticMapImageUri({
                width: 300,
                height: 200,
                lat: sight.latitude,
                lng: sight.longitude,
                zoom: 13,
                x2: true,
            })}
            alt="Карта"
            className="feed-item--content__sight-map" />
    </>
);
