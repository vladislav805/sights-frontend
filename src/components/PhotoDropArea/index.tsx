import * as React from 'react';
import './style.scss';
import { mdiUpload } from '@mdi/js';
import exifr from 'exifr';
import TextIconified from '../TextIconified';
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

const PhotoDropArea: React.FC<IPhotoDropAreaProps> = ({ onPhotoDropped }: IPhotoDropAreaProps) => {
    const onDrop = React.useMemo(() => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const { files } = event.target;

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

        Promise.all([
            readImageAsDataUrl(file),
            exifr.gps(file),
        ])
            .then(([url, point]: [string, IPoint]) => onPhotoDropped(file, url, point));

        // eslint-disable-next-line no-param-reassign
        event.target.value = null;
    }, [onPhotoDropped]);

    return (
        <div className="photoDropArea">
            <input
                type="file"
                className="photoDropArea-input"
                onChange={onDrop} />
            <TextIconified icon={mdiUpload}>
                Загрузить фотографию (до 10 МБ)
            </TextIconified>
        </div>
    );
};

export default PhotoDropArea;
