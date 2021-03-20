import * as React from 'react';
import Lightbox from 'react-image-lightbox';
import { mdiCodeBraces } from '@mdi/js';
import { IPhoto } from '../../../api/types/photo';
import { Format, humanizeDateTime } from '../../../utils/date';
import GalleryButton from '../../../components/SightPhotoLayout/GalleryButton';
import copyTextToClipboard from '../../../utils/clipboard';
import { showToast } from '../../../ui-non-react/toast';

type IPhotoViewerProps = {
    photos: IPhoto[];
    current: number;
    onClickPhoto: (index: number) => void;
};

const zIndex = '1930';
const fixZIndex = {
    overlay: { zIndex },
    content: { zIndex },
};

export const PhotoViewer: React.FC<IPhotoViewerProps> = ({ photos, current, onClickPhoto }: IPhotoViewerProps) => {
    if (current < 0) {
        return null;
    }
    const prev = photos[current - 1];
    const cur = photos[current];
    const next = photos[current + 1];

    const renderGalleryToolbar = () => {
        const onCopyMDCode = () => {
            const photo = photos[current];
            copyTextToClipboard(`[photo:${photo.photoId}_0][/photo]`); // TODO
            showToast('Код для вставки фотографии в коллекцию скопирован!');
        };

        return [
            {
                key: 'copy_md',
                icon: mdiCodeBraces,
                label: 'Копировать код для вставки в коллекцию',
                onClick: onCopyMDCode,
            },
        ]
            .filter(Boolean)
            .map(props => React.createElement(GalleryButton, props));
    };

    const toLoop = (n: number, delta: -1 | 1) => (photos.length + n + delta) % photos.length;
    const onPrevPhotoRequest = () => onClickPhoto(toLoop(current, -1));
    const onNextPhotoRequest = () => onClickPhoto(toLoop(current, 1));
    const onCloseRequest = () => onClickPhoto(-1);

    return (
        <Lightbox
            prevSrc={prev?.photoMax}
            prevSrcThumbnail={prev?.photo200}
            mainSrc={cur.photoMax}
            mainSrcThumbnail={cur.photo200}
            nextSrc={next?.photoMax}
            nextSrcThumbnail={next?.photo200}
            clickOutsideToClose
            imageTitle={`${current + 1} из ${photos.length}`}
            imageCaption={humanizeDateTime(cur.date, Format.FULL)}
            onMovePrevRequest={onPrevPhotoRequest}
            onMoveNextRequest={onNextPhotoRequest}
            onCloseRequest={onCloseRequest}
            zoomInLabel="Увеличить"
            zoomOutLabel="Уменьшить"
            closeLabel="Закрыть"
            prevLabel="Предыдущая"
            nextLabel="Следующая"
            imagePadding={0}
            toolbarButtons={renderGalleryToolbar()}
            reactModalStyle={fixZIndex} />
    );
};
