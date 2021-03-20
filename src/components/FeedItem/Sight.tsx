import * as React from 'react';
import { Link } from 'react-router-dom';
import { getStaticMapImageUri } from '../../utils/getStaticMapImageUri';
import { IFeedBaseProps } from './common';
import { genderize } from '../../utils/genderize';
import { IUser } from '../../api/types/user';
import { IFeedItemSight } from '../../api/types/feed';

export const getSightFeedItemHeader = (user: IUser): string =>
    `${genderize(user, 'добавил', 'добавила')} новую достопримечательность`;

export const SightFeedItem: React.FC<IFeedBaseProps<IFeedItemSight>> = ({
    item,
    sights,
}: IFeedBaseProps<IFeedItemSight>) => {
    const sight = sights.get(item.sightId);

    return (
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
};
