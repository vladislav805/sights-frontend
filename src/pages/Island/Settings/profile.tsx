import * as React from 'react';
import './style.scss';
import Button from '../../../components/Button';
import TextInput, { TextInputType } from '../../../components/TextInput';
import API, { IUser, UserSex } from '../../../api';
import LoadingWrapper from '../../../components/LoadingWrapper';
import Select from '../../../components/Select';
import { genders } from '../sex';
import { withCheckForAuthorizedUser } from '../../../hoc';

type IProfileSettingsProps = never;

interface IProfileSettingsState {
    loading: boolean;
    busy: boolean;
    user?: IUser;
}

class ProfileSettings extends React.Component<IProfileSettingsProps, IProfileSettingsState> {
    state: IProfileSettingsState = {
        loading: true,
        busy: false,
    };

    componentDidMount() {
        void this.fetchUserInfo();
    }

    private fetchUserInfo = async() => {
        const user = await API.users.getUser(undefined, ['city']);

        this.setState({ user, loading: false });
    };

    private onChange = (name: string, value: string) => {
        console.log(name, value);
        this.setState({ user: { ...this.state.user, [name]: value } } as Record<keyof IProfileSettingsState, never>);
    };

    private onChangeSelect = (name: string, index: number, item: UserSex) => {
        this.setState({ user: { ...this.state.user, [name]: item } } as Record<keyof IProfileSettingsState, never>);
    };

    private onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        this.setState({
            busy: true
        }, () => {
            const { firstName, lastName, sex, city: { cityId } } = this.state.user;
            const params = { firstName, lastName, sex, cityId };

            void API.account.editInfo(params).then(() => this.setState({ busy: false }));
        });

    };

    render() {
        if (this.state.loading) {
            return (
                <LoadingWrapper loading />
            );
        }

        const { busy, user } = this.state;

        return (
            <form
                className="settings-form"
                onSubmit={this.onSubmit}>
                <TextInput
                    type={TextInputType.text}
                    name="firstName"
                    label="Имя"
                    value={user.firstName}
                    onChange={this.onChange}
                    disabled={busy} />
                <TextInput
                    type={TextInputType.text}
                    name="lastName"
                    label="Фамилия"
                    value={user.lastName}
                    onChange={this.onChange}
                    disabled={busy} />
                <Select
                    selectedIndex={genders.findIndex(item => item.data === user.sex)}
                    name="sex"
                    label="Пол"
                    onSelect={this.onChangeSelect}
                    items={genders} />
                <Button
                    color="primary"
                    type="submit"
                    label="Сохранить"
                    loading={busy} />
            </form>
        );
    }
}

export default withCheckForAuthorizedUser(ProfileSettings);
