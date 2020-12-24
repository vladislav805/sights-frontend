import * as React from 'react';
import './controller.scss';
import PhotoEntry from './entry';
import PhotoDropArea, { IPhotoTemporary } from '../PhotoDropArea';
import { uploadPhoto } from './uploader';
import API, { ISight } from '../../api';
import type { IPhoto } from '../../api';

type IPhotoControllerProps = {
    sight: ISight;
    photos: IPhoto[];
    onPhotoListChanged: (photos: IPhoto[]) => void;
};

const PhotoController: React.FC<IPhotoControllerProps> = (props: IPhotoControllerProps) => {
    const [temporary, setTemporary] = React.useState<IPhotoTemporary[]>([]);

    const onRemovePermanent = React.useMemo(() => {
        return (target: IPhoto) => {
            props.onPhotoListChanged(props.photos.filter(photo => photo.photoId !== target.photoId));

            void API.photos.remove({ photoId: target.photoId })
        }
    }, [props.photos]);

    const { addTemporary, onRemoveTemporary } = React.useMemo(() => {
        return {
            addTemporary: (file: File, thumbnailUrl: string) => {
                const tempPhoto: IPhotoTemporary = {
                    temporary: true,
                    id: `${Date.now()}_${file.name}`,
                    thumbnail: thumbnailUrl,
                };

                setTemporary(temporary.concat([tempPhoto]));

                void uploadPhoto(file, 1).then(photo => {
                    onRemoveTemporary(tempPhoto);
                    props.onPhotoListChanged(props.photos.concat([photo]));
                });
            },
            onRemoveTemporary: (target: IPhotoTemporary) => {
                setTemporary(temporary.filter(photo => photo.id !== target.id));
            },
        };
    }, [temporary]);

    const commonLength = temporary.length + props.photos.length;

    return (
        <div
            className="photoCtl">
            {props.photos.map(photo => (
                <PhotoEntry
                    key={photo.photoId}
                    sight={props.sight}
                    photo={photo}
                    onRemove={onRemovePermanent} />
            ))}
            {temporary.map(photo => (
                <PhotoEntry
                    key={photo.id}
                    sight={props.sight}
                    photo={photo}
                    onRemove={onRemoveTemporary} />
            ))}
            {commonLength < 10 && (
                <PhotoDropArea
                    onPhotoDropped={addTemporary} />
            )}
        </div>
    )
};

export default PhotoController;
