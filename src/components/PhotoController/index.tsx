import * as React from 'react';
import './controller.scss';
import PhotoEntry from './entry';
import PhotoDropArea, { IPhotoTemporary } from '../PhotoDropArea';
import { uploadPhoto } from './uploader';
import { ISight } from '../../api/types/sight';
import { IPhoto } from '../../api/types/photo';
import API from '../../api';
import { IPoint } from '../../api/types/point';
import * as Modal from '../Modal';
import LoadingSpinner from '../LoadingSpinner';
import { ReactSortable } from 'react-sortablejs';

type IPhotoControllerProps = {
    sight: ISight;
    photos: IPhoto[];
    onCenterByPhoto: (point: IPoint) => void;
    onPhotoListChanged: (photos: IPhoto[]) => void;
};

const PhotoController: React.FC<IPhotoControllerProps> = (props: IPhotoControllerProps) => {
    const [temporary, setTemporary] = React.useState<IPhotoTemporary[]>([]);

    const onRemovePermanent = React.useMemo(() => {
        return (target: IPhoto) => {
            props.onPhotoListChanged(props.photos.filter(photo => photo.photoId !== target.photoId));

            void API.photos.remove({ photoId: target.photoId })
        }
    }, [props.photos, props.onPhotoListChanged]);

    const { addTemporary, onRemoveTemporary } = React.useMemo(() => ({
        addTemporary: (file: File, thumbnailUrl: string, point?: IPoint) => {
            const tempPhoto: IPhotoTemporary = {
                temporary: true,
                id: `${Date.now()}_${file.name}`,
                thumbnail: thumbnailUrl,
                point,
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
    }), [temporary, props.onPhotoListChanged, props.photos]);

    const commonLength = temporary.length + props.photos.length;

    return (
        <div className="photoCtl">
            <div className="photoCtl-list">
                <ReactSortable
                    id="photoId"
                    list={props.photos.map(photo => ({ ...photo, id: photo.photoId }))}
                    setList={photos => props.onPhotoListChanged(photos)}>
                    {props.photos.map(photo => (
                        <PhotoEntry
                            key={photo.photoId}
                            sight={props.sight}
                            photo={photo}
                            onCenterByPhoto={props.onCenterByPhoto}
                            onRemove={onRemovePermanent} />
                    ))}
                </ReactSortable>
                {temporary.map(photo => (
                    <PhotoEntry
                        key={photo.id}
                        sight={props.sight}
                        photo={photo}
                        onCenterByPhoto={props.onCenterByPhoto}
                        onRemove={onRemoveTemporary} />
                ))}
            </div>
            {commonLength < 10 && (
                <PhotoDropArea
                    onPhotoDropped={addTemporary} />
            )}
            <Modal.Window show={temporary.length > 0}>
                <Modal.Title>Загрузка фотографии</Modal.Title>
                <Modal.Content>
                    <LoadingSpinner block size="l" />
                </Modal.Content>
            </Modal.Window>
        </div>
    );
};

export default PhotoController;
