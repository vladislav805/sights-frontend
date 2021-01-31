import * as React from 'react';
import { Link } from 'react-router-dom';
import { genderize } from '../../utils';
import { IUser } from '../../api/types/user';
import { IFeedItemPhoto } from '../../api/types/feed';
import { IFeedBaseProps } from './common';
import DynamicTooltip from '../DynamicTooltip';

export const getPhotoFeedItemHeader = (props: IFeedBaseProps<IFeedItemPhoto>, user: IUser): React.ReactNode => {
    const sight = props.sights.get(props.item.sightId);
    return (
        <>
            {genderize(user, 'загрузил', 'загрузила')} фотографию к достопримечательности{' '}
            <DynamicTooltip type="sight" id={sight.sightId}>
                <Link to={`/sight/${sight.sightId}`}>{sight.title}</Link>
            </DynamicTooltip>
        </>
    );
};

export const PhotoFeedItem: React.FC<IFeedBaseProps<IFeedItemPhoto>> = (props: IFeedBaseProps<IFeedItemPhoto>) => {
    const sight = props.sights.get(props.item.sightId);
    const photo = props.photos.get(props.item.photoId);
    return (
        <>
            <h4><Link to={`/sight/${sight.sightId}`}>{sight.title}</Link></h4>
            <img src={photo.photoMax} alt='фото' className='feed-item--content__photo-image' />
        </>
    );
};
