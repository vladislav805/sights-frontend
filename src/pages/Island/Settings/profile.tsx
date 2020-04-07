import * as React from 'react';
import './style.scss';
import Button from '../../../components/Button';
import TextInput, { TextInputType } from '../../../components/TextInput';
import api, { IUser, UserSex } from '../../../api';
import LoadingWrapper from '../../../components/LoadingWrapper';
import { IWithSessionListener, withSessionListener } from '../../../session/withSessionListener';
import { SessionResolveListener } from '../../../session';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Select from '../../../components/Select';
import { genders } from '../sex';

type IProfileSettingsProps = {} & IWithSessionListener & RouteComponentProps<never>;

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
        this.props.onSessionResolved(this.onSessionResolved);
    }

    private onSessionResolved: SessionResolveListener = user => {
        if (user) {
            this.fetchUserInfo();
        } else {
            this.props.history.replace('/');
        }
    };

    private fetchUserInfo = async() => {
        const [user] = await api<IUser[]>('users.get', {
            extra: ['city', 'extended'],
        });

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
            console.log(params);

            api<true>('account.editInfo', params).then(() => this.setState({ busy: false }));
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

export default withRouter(withSessionListener(ProfileSettings));
