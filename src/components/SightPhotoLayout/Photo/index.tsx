import * as React from 'react';
import './style.scss';
import { IPhoto } from '../../../api';

export type PhotoOpenCallback = (photo: IPhoto) => void;

interface IPhotoProps {
    photo: IPhoto;
    onPhotoOpen?: PhotoOpenCallback;
}

const Photo: React.FC<IPhotoProps> = ({ photo, onPhotoOpen }: IPhotoProps) => {
    const onClick = () => onPhotoOpen?.(photo);
    return (
        <div className="photo-item" onClick={onClick}>
            <img src={photo.photo200} alt="Thumb" />
        </div>
    );
};

export default Photo;
