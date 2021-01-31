import * as React from 'react';
import { getStaticMapImageUri } from '../../utils/getStaticMapImageUri';
import { Link } from 'react-router-dom';
import { IFeedBaseProps } from './common';
import { genderize } from '../../utils';
import { IUser } from '../../api/types/user';
import { IFeedItemSight } from '../../api/types/feed';

export const getSightFeedItemHeader = (user: IUser): string =>
    `${genderize(user, 'добавил', 'добавила')} новую достопримечательность`;

export const SightFeedItem: React.FC<IFeedBaseProps<IFeedItemSight>> = (props: IFeedBaseProps<IFeedItemSight>) => {
    const sight = props.sights.get(props.item.sightId);

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
                alt='Карта'
                className='feed-item--content__sight-map' />
        </>
    );
};
