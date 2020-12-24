import * as React from 'react';
import './style.scss';
import TextIconified from '../TextIconified';
import { mdiUpload } from '@mdi/js';

type IPhotoDropAreaProps = {
    onPhotoDropped: (file: File, thumbnailUrl: string) => void;
};

export type IPhotoTemporary = {
    temporary: true;
    id: string;
    thumbnail: string;
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
                alert('Файл не выбран');
                return;
            }

            if (!file.type.includes('image/')) {
                alert('Выбранный файл не является изображением');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert('Файл должен быть не более 10 МБ');
                return;
            }

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                props.onPhotoDropped(file, reader.result as string)
            });
            reader.readAsDataURL(file);

            event.target.value = null;
        };
    }, []);
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
