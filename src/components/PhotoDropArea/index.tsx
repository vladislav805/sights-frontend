import * as React from 'react';
import './style.scss';
import TextIconified from '../TextIconified';
import { mdiUpload } from '@mdi/js';
import exifr from 'exifr';
import { readImageAsDataUrl } from '../../utils/read-image-as-data-url';
import { IPoint } from '../../api/types/point';
import { showToast } from '../../ui-non-react/toast';

type IPhotoDropAreaProps = {
    onPhotoDropped: (file: File, thumbnailUrl: string, point?: IPoint) => void;
};

export type IPhotoTemporary = {
    temporary: true;
    id: string;
    thumbnail: string;
    point?: IPoint;
};

const PhotoDropArea: React.FC<IPhotoDropAreaProps> = (props: IPhotoDropAreaProps) => {
    const onDrop = React.useMemo(() => {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault();

            const files = event.target.files;

            if (!files.length) {
                return;
            }

            const file = files.item(0);

            if (!file) {
                showToast('Файл не выбран');
                return;
            }

            if (!file.type.includes('image/')) {
                showToast('Выбранный файл не является изображением');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                showToast('Файл должен быть не более 10 МБ');
                return;
            }

            void Promise.all([
                readImageAsDataUrl(file),
                exifr.gps(file),
            ])
                .then(([url, point]: [string, IPoint]) => props.onPhotoDropped(file, url, point))

            event.target.value = null;
        };
    }, [props.onPhotoDropped]);

    return (
        <div className="photoDropArea">
            <input
                type="file"
                className={'photoDropArea-input'}
                onChange={onDrop}/>
            <TextIconified icon={mdiUpload}>
                Загрузить фотографию (до 10 МБ)
            </TextIconified>
        </div>
    );
};

export default PhotoDropArea;
