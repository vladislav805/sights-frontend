import * as React from 'react';
import './style.scss';
import 'react-image-lightbox/style.css';
import Lightbox from 'react-image-lightbox';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { mdiAlert, mdiDelete, mdiImageOff } from '@mdi/js';
import API, { IUsablePhoto, IUser } from '../../api';
import { entriesToMap, Format, humanizeDateTime, genderize } from '../../utils';
import LoadingSpinner from '../LoadingSpinner';
import Photo from './Photo';
import GalleryButton from './GalleryButton';
import InfoSplash from '../InfoSplash';
import StickyHeader from '../StickyHeader';

interface ISightPhotoLayoutProps {
    sightId: number;
    currentUser: IUser;
}

interface ISightPhotoLayoutState {
    count?: number;
    items?: IUsablePhoto[];
    current?: number;
}

class SightPhotoLayout extends React.Component<ISightPhotoLayoutProps, ISightPhotoLayoutState> {
    state: ISightPhotoLayoutState = {
        current: -1,
    };

    componentDidMount() {
        this.fetchPhotos();
    }

    private fetchPhotos = async() => {
        const { count, items, users } = await API.photos.get(this.props.sightId);

        const usersAssoc = entriesToMap(users, 'userId');

        this.setState({
            count,
            items: items.map(photo => ({
                ...photo,
                user: usersAssoc.get(photo.ownerId),
            }) as IUsablePhoto),
        });
    };

    private onPhotoClick = (photo: IUsablePhoto) => {
        this.setState(state => ({
            current: state.items.indexOf(photo),
        }));
    };

    private toLoop = (n: number, delta: -1 | 1) => (this.state.items.length + n + delta) % this.state.items.length;

    private getGalleryPhotos = (): [IUsablePhoto, IUsablePhoto, IUsablePhoto] => {
        const { items, current } = this.state;

        return current < 0
            ? [null, null, null]
            : [
                items[this.toLoop(current, -1)],
                items[current],
                items[this.toLoop(current, 1)],
            ];
    };

    private getLightBoxTitle = (photo: IUsablePhoto) => {
        const { user, date } = photo;
        return (
            <>
                <Link to={`/sight/${user.login}`}>{user.firstName} {user.lastName}</Link> {genderize(user, 'добавил', 'добавила')} {humanizeDateTime(date, Format.FULL)}
            </>
        )
    };

    private renderGalleryToolbar = () => {
        const me = this.props.currentUser;
        const { items, current } = this.state;
        const photo = items[current];

        const own = photo.user.userId === me?.userId;

        return [
            own && {
                key: 'remove',
                icon: mdiDelete,
                label: 'Удалить',
                onClick: this.onRemove,
            },
            !own && {
                key: 'report',
                icon: mdiAlert,
                label: 'Пожаловаться',
                onClick: this.onReport,
            },
        ].filter(Boolean).map(props => React.createElement(GalleryButton, props));
    };

    private renderList = () => {
        const items = this.state.items;

        if (!items) {
            return <LoadingSpinner size="l" />;
        }

        if (!items.length) {
            return <InfoSplash icon={mdiImageOff} iconSize="s" description="Нет фотографий" />;
        }

        return items.map(photo => (
            <Photo
                key={photo.photoId}
                photo={photo}
                onPhotoOpen={this.onPhotoClick} />
        ));
    };

    private onRemove = () => {
        if (!confirm('Вы уверены, что хотите удалить фотографию?')) {
            return;
        }
    };

    private onReport = async() => {
        if (!confirm('Вы уверены, что хотите пожаловаться на фотографию?')) {
            return;
        }

        const { items, current } = this.state;
        const photo = items[current];

        const res = await API.photos.report(this.props.sightId, photo.photoId);

        if (res) {
            alert('Спасибо! Жалоба будет рассмотрена в ближайшее время.');
        }
    };

    private onPrevPhotoRequest = () => this.setState(({ current }) => ({ current: this.toLoop(current, -1) }));
    private onNextPhotoRequest = () => this.setState(({ current }) => ({ current: this.toLoop(current, 1) }));
    private onCloseRequest = () => this.setState({ current: -1 });

    render() {
        const { items, current } = this.state;
        const photo = current >= 0 && items[current];

        const [prev, cur, next] = this.getGalleryPhotos();
        return (
            <>
                <div className={classNames('photos', {
                    'photos__loading': !items,
                })}>
                    <StickyHeader
                        showHeader
                        left="Фотографии"
                        right={items && `${items.length} фото`}>
                        <div className="photos-list">
                            {this.renderList()}
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
                        imageTitle={`${current + 1} из ${items.length}`}
                        imageCaption={this.getLightBoxTitle(cur)}
                        onMovePrevRequest={this.onPrevPhotoRequest}
                        onMoveNextRequest={this.onNextPhotoRequest}
                        onCloseRequest={this.onCloseRequest}
                        zoomInLabel="Увеличить"
                        zoomOutLabel="Уменьшить"
                        closeLabel="Закрыть"
                        prevLabel="Предыдущая"
                        nextLabel="Следующая"
                        imagePadding={0}
                        toolbarButtons={this.renderGalleryToolbar()}
                    />
                )}
            </>
        );
    }
}

export default SightPhotoLayout;
