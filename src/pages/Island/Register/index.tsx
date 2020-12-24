import * as React from 'react';
import '../Settings/style.scss';
import Reaptcha from 'reaptcha';
import API from '../../../api';
import TextInput from '../../../components/TextInput';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { genders } from '../sex';
import AttentionBlock from '../../../components/AttentionBlock';
import { withCheckForAuthorizedUser } from '../../../hoc';
import { Sex } from '../../../api/types/user';

type IRegisterProps = never;

type IRegisterFields = {
    firstName: string;
    lastName: string;
    sex: Sex;
    login: string;
    email?: string;
    password: string;
    captcha?: string;
}

interface IRegisterState extends Partial<IRegisterFields> {
    busy: boolean;
    attention?: { type: 'error' | 'info'; text: string };
}

class Register extends React.Component<IRegisterProps, IRegisterState> {
    state: IRegisterState = {
        busy: false,
        sex: Sex.NONE,
    };

    private onChange = (name: string, value: string) => {
        this.setState({ [name]: value } as Record<keyof IRegisterFields, never>);
    };

    private onChangeSelect = (name: string, item: string) => {
        this.setState({ [name]: item } as Record<keyof IRegisterFields, never>);
    };

    private onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        this.setState({
            busy: true,
            attention: undefined,
        }, () => void this.register());
    };

    private register = async() => {
        const { firstName, lastName, sex, email, password, captcha, login } = this.state;
        const params = { firstName, lastName, sex, email, password, captchaId: captcha, login, v: 250 };
        try {
            await API.account.create(params);

            this.setState({
                attention: {
                    type: 'info',
                    text: 'Вы успешно зарегистрировались. На указанный email отправлено письмо ссылкой активации.',
                },
            });
        } catch (e) {
            this.setState({
                attention: {
                    type: 'error',
                    text: (e as Error).message,
                },
                busy: false
            });
        }
    }

    private onVerify = (captcha: string) => this.setState({ captcha });
    private onExpire = () => this.setState({ captcha: undefined });

    render() {
        const { busy, firstName, lastName, sex, password, login, email, captcha, attention } = this.state;

        return (
            <form className="settings-form" onSubmit={this.onSubmit}>
                <h2>Регистрация</h2>
                <TextInput
                    type="text"
                    name="firstName"
                    label="Имя"
                    value={firstName}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type="text"
                    name="lastName"
                    label="Фамилия"
                    value={lastName}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <Select
                    selectedIndex={genders.findIndex(item => item.data === sex)}
                    name="sex"
                    label="Пол"
                    onSelect={this.onChangeSelect}
                    items={genders} />
                <TextInput
                    type="text"
                    name="login"
                    label="Логин"
                    value={login}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type="email"
                    name="email"
                    label="E-mail"
                    value={email}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type="password"
                    name="password"
                    label="Пароль"
                    value={password}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <Reaptcha
                    sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
                    onVerify={this.onVerify}
                    onExpire={this.onExpire}
                    size="normal" />
                {attention && (
                    <AttentionBlock
                        show
                        type={attention.type}
                        text={attention.text} />
                )}
                <Button
                    color="primary"
                    type="submit"
                    label="Далее"
                    disabled={!captcha}
                    loading={busy} />
            </form>
        )
    }
}

export default withCheckForAuthorizedUser(Register, {
    needUser: false,
});
