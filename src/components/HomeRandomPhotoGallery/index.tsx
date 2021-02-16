import * as React from 'react';
import './style.scss';
import { IHomeRandomPhoto } from '../../api/local-types';
import { Link } from 'react-router-dom';

type IHomeRandomPhotoGalleryProps = {
    photos: IHomeRandomPhoto[];
};

const HomeRandomPhotoGallery: React.FC<IHomeRandomPhotoGalleryProps> = (props: IHomeRandomPhotoGalleryProps) => {

    return (
        <div className="home-gallery">
            {props.photos?.map(({ photo, sightId }) => (
                <Link key={photo.photoId} className="home-gallery--item" to={`/sight/${sightId}`}>
                    <img className="home-gallery--photo" src={photo.photo200} alt="photo" />
                </Link>
            ))}
        </div>
    );
};

export default HomeRandomPhotoGallery;
