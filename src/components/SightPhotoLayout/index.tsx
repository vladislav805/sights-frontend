import * as React from 'react';
import './style.scss';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mdiAlert, mdiCodeBraces, mdiDelete, mdiImageOff } from '@mdi/js';
import { Format, genderize, humanizeDateTime } from '../../utils';
import LoadingSpinner from '../LoadingSpinner';
import Photo from './Photo';
import GalleryButton from './GalleryButton';
import InfoSplash from '../InfoSplash';
import StickyHeader from '../StickyHeader';
import { IPhoto } from '../../api/types/photo';
import { IUser } from '../../api/types/user';
import copyTextToClipboard from '../../utils/clipboard';

type ISightPhotoLayoutProps = {
    sightId: number;
    photos: IPhoto[];
    users: Map<number, IUser>;
    currentUser: IUser;
};

const zIndex = '1930';
const fixZIndex = {
    overlay: { zIndex },
    content: { zIndex },
};

const SightPhotoLayout: React.FC<ISightPhotoLayoutProps> = ({ sightId, photos, users, currentUser }: ISightPhotoLayoutProps) => {
    const [current, setCurrent] = React.useState<number>(-1);
    const refPhotoList = React.useRef<HTMLDivElement>();

    const onPhotoClick = (photo: IPhoto) => {
        setCurrent(photos.indexOf(photo));
    };

    const toLoop = (n: number, delta: -1 | 1) => (photos.length + n + delta) % photos.length;

    const getGalleryPhotos = (): [IPhoto, IPhoto, IPhoto] => {
        return current < 0
            ? [null, null, null]
            : [
                photos[toLoop(current, -1)],
                photos[current],
                photos[toLoop(current, 1)],
            ];
    };

    const getLightBoxTitle = (photo: IPhoto) => {
        const { date } = photo;
        const user = users.get(photo.ownerId);
        return (
            <>
                <Link to={`/sight/${user.login}`}>{user.firstName} {user.lastName}</Link> {genderize(user, 'добавил', 'добавила')} {humanizeDateTime(date, Format.FULL)}
            </>
        );
    };

    const renderGalleryToolbar = () => {
        const me = currentUser;
        const photo = photos[current];
        const user = users.get(photo.ownerId);
        const own = user.userId === me?.userId;

        return [
            {
                key: 'copy_md',
                icon: mdiCodeBraces,
                label: 'Копировать код для вставки в коллекцию',
                onClick: onCopyMDCode,
            },
            own && {
                key: 'remove',
                icon: mdiDelete,
                label: 'Удалить',
                onClick: onRemove,
            },
            !own && {
                key: 'report',
                icon: mdiAlert,
                label: 'Пожаловаться',
                onClick: onReport,
            },
        ]
            .filter(Boolean)
            .map(props => React.createElement(GalleryButton, props));
    };

    const renderList = () => {
        if (!photos) {
            return (
                <LoadingSpinner size="l" />
            );
        }

        if (!photos.length) {
            return (
                <InfoSplash
                    icon={mdiImageOff}
                    iconSize="s"
                    description="Нет фотографий" />
            );
        }

        return photos.map(photo => (
            <Photo
                key={photo.photoId}
                photo={photo}
                onPhotoOpen={onPhotoClick} />
        ));
    };

    const onCopyMDCode = () => {
        const photo = photos[current];
        void copyTextToClipboard(`[photo:${photo.photoId}_${sightId}][/photo]`);
    };

    const onRemove = () => {
        if (!confirm('Вы уверены, что хотите удалить фотографию?')) {
            return;
        }
    };

    const onReport = () => {
        if (!confirm('Вы уверены, что хотите пожаловаться на фотографию?')) {
            return;
        }

        // const photo = photos[current];
        // const res = await API.photos.report(sightId, photo.photoId);

        /*if (res) {
            alert('Спасибо! Жалоба будет рассмотрена в ближайшее время.');
        }*/
    };

    const onPrevPhotoRequest = () => setCurrent(toLoop(current, -1));
    const onNextPhotoRequest = () => setCurrent(toLoop(current, 1));
    const onCloseRequest = () => setCurrent(-1);

    React.useEffect(() => {
        const wheelListener = (event: WheelEvent) => {
            if (event.deltaY) {
                event.preventDefault();
                refPhotoList.current.scrollBy({ left: +event.deltaY });
            }
        };

        refPhotoList.current.addEventListener('wheel', wheelListener);

        return () => {
            refPhotoList.current.removeEventListener('wheel', wheelListener);
        };
    }, []);

    const photo = current >= 0 && photos[current];

    const [prev, cur, next] = getGalleryPhotos();
    return (
        <>
            <div className={classNames('photos', {
                'photos__loading': !photos,
            })} data-count={photos?.length ?? -1}>
                <StickyHeader
                    showHeader
                    left="Фотографии"
                    right={photos && `${photos.length} фото`}>
                    <div
                        className="photos-list"
                        ref={refPhotoList}>
                        {renderList()}
                    </div>
                </StickyHeader>
            </div>
            {photo && (
                <Lightbox
                    prevSrc={prev?.photoMax}
                    prevSrcThumbnail={prev?.photo200}
                    mainSrc={cur.photoMax}
                    mainSrcThumbnail={cur.photo200}
                    nextSrc={next?.photoMax}
                    nextSrcThumbnail={next?.photo200}
                    clickOutsideToClose
                    imageTitle={`${current + 1} из ${photos.length}`}
                    imageCaption={getLightBoxTitle(cur)}
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
            )}
        </>
    );
}

export default SightPhotoLayout;
