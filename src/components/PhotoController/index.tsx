import * as React from 'react';
import './controller.scss';
import { ReactSortable } from 'react-sortablejs';
import PhotoEntry from './entry';
import PhotoDropArea, { IPhotoTemporary } from '../PhotoDropArea';
import { uploadPhoto } from './uploader';
import { ISight } from '../../api/types/sight';
import { IPhoto } from '../../api/types/photo';
import API from '../../api';
import { IPoint } from '../../api/types/point';
import * as Modal from '../Modal';
import LoadingSpinner from '../LoadingSpinner';
import { showToast } from '../../ui-non-react/toast';

type IPhotoControllerProps = {
    sight: ISight;
    photos: IPhoto[];
    onCenterByPhoto: (point: IPoint) => void;
    onPhotoListChanged: (photos: IPhoto[]) => void;
};

const PhotoController: React.FC<IPhotoControllerProps> = ({
    sight,
    photos,
    onCenterByPhoto,
    onPhotoListChanged,
}: IPhotoControllerProps) => {
    const [temporary, setTemporary] = React.useState<IPhotoTemporary[]>([]);

    const onRemovePermanent = React.useMemo(() => (target: IPhoto) => {
        onPhotoListChanged(photos.filter(photo => photo.photoId !== target.photoId));

        API.photos.remove({ photoId: target.photoId })
            .then(() => showToast('Фотография удалена'));
    }, [photos, onPhotoListChanged]);

    const { addTemporary, onRemoveTemporary } = React.useMemo(() => ({
        addTemporary: (file: File, thumbnailUrl: string, point?: IPoint) => {
            const tempPhoto: IPhotoTemporary = {
                temporary: true,
                id: `${Date.now()}_${file.name}`,
                thumbnail: thumbnailUrl,
                point,
            };

            setTemporary(temporary.concat([tempPhoto]));

            uploadPhoto(file, 1).then(photo => {
                onRemoveTemporary(tempPhoto);
                onPhotoListChanged(photos.concat([photo]));
            });
        },
        onRemoveTemporary: (target: IPhotoTemporary) => {
            setTemporary(temporary.filter(photo => photo.id !== target.id));
        },
    }), [temporary, onPhotoListChanged, photos]);

    const commonLength = temporary.length + photos.length;

    return (
        <div className="photoCtl">
            <div className="photoCtl-list">
                { /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */ }
                {/*
                // @ts-ignore */}
                <ReactSortable
                    id="photoId"
                    handle=".photoCtl-entry--image"
                    list={photos.map(photo => ({ ...photo, id: photo.photoId }))}
                    setList={photos => onPhotoListChanged(photos)}>
                    {photos.map(photo => (
                        <PhotoEntry
                            key={photo.photoId}
                            sight={sight}
                            photo={photo}
                            onCenterByPhoto={onCenterByPhoto}
                            onRemove={onRemovePermanent} />
                    ))}
                </ReactSortable>
                {temporary.map(photo => (
                    <PhotoEntry
                        key={photo.id}
                        sight={sight}
                        photo={photo}
                        onCenterByPhoto={onCenterByPhoto}
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
