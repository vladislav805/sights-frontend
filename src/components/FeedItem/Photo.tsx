import * as React from 'react';
import { Link } from 'react-router-dom';
import { IPhoto, ISight } from '../../api';

type IPhotoFeedItem = {
    photo: IPhoto;
    sight: ISight;
};

export const PhotoFeedItem: React.FC<IPhotoFeedItem> = ({ photo, sight }: IPhotoFeedItem) => (
    <>
        <h4><Link to={`/sight/${sight.sightId}`}>{sight.title}</Link></h4>
        <img src={photo.photoMax} alt="фото" className="feed-item--content__photo-image" />
    </>
);