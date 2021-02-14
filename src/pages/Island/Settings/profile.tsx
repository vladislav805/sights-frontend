import * as React from 'react';
import './style.scss';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import API from '../../../api';
import Select from '../../../components/Select';
import { genders } from '../sex';
import LoadingSpinner from '../../../components/LoadingSpinner';
import * as Modal from '../../../components/Modal';
import CityModal from '../../../components/CityModal';
import FakeTextInput from '../../../components/FakeTextInput';
import { IUser, Sex } from '../../../api/types/user';
import { ICity } from '../../../api/types/city';
import PageTitle from '../../../components/PageTitle';
import { IApiError } from '../../../api/types/base';
import AttentionBlock, { IAttentionBlockProps } from '../../../components/AttentionBlock';
import useCurrentUser from '../../../hook/useCurrentUser';
import { withSessionOnly } from '../../../hoc/withSessionOnly';


const ProfileSettings: React.FC = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [busy, setBusy] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<IUser>();
    const [showCityModal, setShowCityModal] = React.useState<boolean>(false);
    const [info, setInfo] = React.useState<IAttentionBlockProps>();
    const currentUser = useCurrentUser();

    const canChangeLogin = React.useMemo(() => {
        return currentUser.login === `id${currentUser.userId}`;
    }, [currentUser]);

    React.useEffect(() => {
        void API.users.getUser(undefined, ['city']).then(user => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    const onChangeCity = React.useMemo(() => {
        return (city: ICity) => {
            setUser({ ...user, city });
            setShowCityModal(false);
        };
    }, [user]);

    const onChangeInput = (name: string, value: string) => setUser({ ...user, [name]: value });
    const onChangeSelect = (name: string, item: Sex) => setUser({ ...user, [name]: item });

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setInfo(null);

        setBusy(true);

        const { firstName, lastName, sex, city, bio, login } = user;
        const params = { firstName, lastName, sex, cityId: city?.cityId ?? null, bio, login };

        if (currentUser.login === login) {
            delete params.login;
        }

        void API.account.edit(params)
            .catch((error: IApiError) => { setInfo({ type: 'error', text: error.message }) })
            .then(() => setBusy(false));
    };

    if (loading) {
        return (
            <LoadingSpinner
                block
                subtitle="Получение информации о пользователе..." />
        );
    }

    return (
        <form
            className="settings-form"
            onSubmit={onSubmit}>
            <PageTitle>Настройки профиля</PageTitle>
            <TextInput
                type="text"
                name="firstName"
                label="Имя"
                value={user.firstName}
                onChange={onChangeInput}
                disabled={busy} />
            <TextInput
                type="text"
                name="lastName"
                label="Фамилия"
                value={user.lastName}
                onChange={onChangeInput}
                disabled={busy} />
            {canChangeLogin && (
                <TextInput
                    type="text"
                    name="login"
                    label="Логин (можно изменить со стандартного только один раз!)"
                    value={user.login}
                    onChange={onChangeInput}
                    disabled={busy} />)
            }
            <Select
                selectedIndex={genders.findIndex(item => item.data === user.sex)}
                name="sex"
                label="Пол"
                onSelect={onChangeSelect}
                items={genders} />
            <FakeTextInput
                label="Город"
                value={user.city ? user.city.name : 'не выбран'}
                onClick={() => setShowCityModal(true)} />
            <TextInput
                type="textarea"
                name="bio"
                label="О себе"
                value={user.bio}
                onChange={onChangeInput}
                disabled={busy} />
            <Button
                color="primary"
                type="submit"
                label="Сохранить"
                loading={busy} />
            {info && (
                <AttentionBlock
                    type={info.type}
                    text={info.text} />
            )}
            <Modal.Window
                show={showCityModal}
                onOverlayClick={() => setShowCityModal(false)}>
                <CityModal
                    selected={user.city}
                    onChange={onChangeCity} />
            </Modal.Window>
        </form>
    );
}

export default withSessionOnly(ProfileSettings);
