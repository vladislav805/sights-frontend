import * as React from 'react';
import './style.scss';
import Button from '../../../components/Button';
import TextInput, { TextInputType } from '../../../components/TextInput';
import API, { ICity, IUser, UserSex } from '../../../api';
import Select from '../../../components/Select';
import { genders } from '../sex';
import { withCheckForAuthorizedUser } from '../../../hoc';
import LoadingSpinner from '../../../components/LoadingSpinner';
import withSpinnerWrapper from '../../../components/LoadingSpinner/wrapper';
import * as Modal from '../../../components/Modal';
import CityModal from '../../../components/CityModal';

type IProfileSettingsProps = never;

const ProfileSettings: React.FC<IProfileSettingsProps> = () => {
    const [loading, setLoading] = React.useState<boolean>(true);
    const [busy, setBusy] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<IUser>();
    const [openCityModal, setOpenCityModal] = React.useState<boolean>(false);

    React.useEffect(() => {
        void API.users.getUser(undefined, ['city']).then(user => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    const onChangeInput = (name: string, value: string) => setUser({ ...user, [name]: value });
    const onChangeSelect = (name: string, item: UserSex) => setUser({ ...user, [name]: item });
    const onChangeCity = (city: ICity) => setUser({ ...user, city });

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        setBusy(true);

        const { firstName, lastName, sex, city, bio } = user;
        const params = { firstName, lastName, sex, cityId: city.cityId, bio };

        void API.account.edit(params).then(() => setBusy(false));
    };

    if (loading) {
        return withSpinnerWrapper(<LoadingSpinner />);
    }

    return (
        <form
            className="settings-form"
            onSubmit={onSubmit}>
            <TextInput
                type={TextInputType.text}
                name="firstName"
                label="Имя"
                value={user.firstName}
                onChange={onChangeInput}
                disabled={busy} />
            <TextInput
                type={TextInputType.text}
                name="lastName"
                label="Фамилия"
                value={user.lastName}
                onChange={onChangeInput}
                disabled={busy} />
            <Select
                selectedIndex={genders.findIndex(item => item.data === user.sex)}
                name="sex"
                label="Пол"
                onSelect={onChangeSelect}
                items={genders} />
            <Button
                label={`Город: ${user.city ? user.city.name : '*не выбран*'}`}
                onClick={() => setOpenCityModal(true)} />
            <TextInput
                type={TextInputType.textarea}
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
            <Modal.Window
                show={openCityModal}
                onOverlayClick={() => setOpenCityModal(false)}>
                <CityModal
                    selected={user.city}
                    onChange={city => {
                        onChangeCity(city);
                        setOpenCityModal(false);
                    }} />
            </Modal.Window>
        </form>
    );
}

export default withCheckForAuthorizedUser(ProfileSettings);
