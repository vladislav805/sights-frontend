import * as React from 'react';
import './photo.scss';
import classNames from 'classnames';
import API, { apiRequest } from '../../../api';
import useApiFetch from '../../../hook/useApiFetch';
import LoadingSpinner from '../../../components/LoadingSpinner';
import PageTitle from '../../../components/PageTitle';
import type { IPhoto } from '../../../api/types/photo';
import { PhotoType } from '../../../api/types/photo';
import { withSessionOnly } from '../../../hoc/withSessionOnly';
import Button from '../../../components/Button';
import PhotoDropArea from '../../../components/PhotoDropArea';
import { uploadPhoto } from '../../../components/PhotoController/uploader';
import { showToast } from '../../../ui-non-react/toast';

const fetcher = (): Promise<IPhoto> => apiRequest('execute', {
    code: 'const u=API.users.get({fields:"ava"});return u[0].photo;',
});

const Photo: React.FC = () => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const { result: photo, loading, setResult } = useApiFetch(fetcher);

    const {
        onDeleteCurrent,
        onPhotoDropped,
    } = React.useMemo(() => ({
        onDeleteCurrent: () => {
            setBusy(true);

            API.account.setProfilePhoto({ photoId: -1 })
                .then(fetcher)
                .then(photo => {
                    setBusy(false);
                    setResult(photo);
                    showToast('Фотография успешно удалена');
                });
        },
        onPhotoDropped: (file: File) => {
            setBusy(true);

            uploadPhoto(file, PhotoType.PROFILE)
                .then(photo => API.account.setProfilePhoto({ photoId: photo.photoId }))
                .then(fetcher)
                .then(photo => {
                    setBusy(false);
                    setResult(photo);
                    showToast('Фотография успешно загружена');
                })
                .catch((error: Error) => {
                    showToast(`Ошибка! ${error.message}`);
                });
        },
    }), [photo]);

    if (loading) {
        return (
            <LoadingSpinner
                block
                subtitle="Получение информации о фотографии..." />
        );
    }

    const defaultAva = photo.photoId === 0;

    return (
        <form
            className="settings-form">
            <PageTitle>Фотография пользователя</PageTitle>
            <div className={classNames('settings-ava', {
                'settings-ava__busy': busy,
            })}>
                <img
                    className="settings-ava--photo"
                    src={photo.photoMax}
                    alt="Фотография профиля" />
                <div className="settings-ava--control">
                    {!defaultAva && (
                        <Button
                            onClick={onDeleteCurrent}
                            label="Удалить текущую" />
                    )}
                    <PhotoDropArea
                        onPhotoDropped={onPhotoDropped} />
                </div>
            </div>
        </form>
    );
};

export default withSessionOnly(Photo);
