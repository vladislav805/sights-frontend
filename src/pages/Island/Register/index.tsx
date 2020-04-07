import * as React from 'react';
import '../Settings/style.scss';
import Reaptcha from 'reaptcha';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { IWithSessionListener, withSessionListener } from '../../../session/withSessionListener';
import { SessionResolveListener } from '../../../session';
import LoadingWrapper from '../../../components/LoadingWrapper';
import api, { UserSex } from '../../../api';
import TextInput, { TextInputType } from '../../../components/TextInput';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { genders } from '../sex';
import AttentionBlock from '../../../components/AttentionBlock';

type IRegisterProps = IWithSessionListener & RouteComponentProps<never>;

type IRegisterFields = {
    firstName: string;
    lastName: string;
    sex: UserSex;
    login: string;
    email?: string;
    password: string;
    captcha?: string;
}

interface IRegisterState extends Partial<IRegisterFields> {
    wait: boolean;
    busy: boolean;
    attention?: { type: 'error' | 'info'; text: string };
}

class Register extends React.Component<IRegisterProps, IRegisterState> {
    state: IRegisterState = {
        wait: true,
        busy: false,
        sex: UserSex.NOT_SET,
    };

    componentDidMount() {
        this.props.onSessionResolved(this.onSessionResolved);
    }

    private onSessionResolved: SessionResolveListener = user => {
        if (user) {
            this.props.history.replace('/');
        } else {
            this.setState({wait: false});
        }
    };

    private onChange = (name: string, value: string) => {
        this.setState({ [name]: value } as Record<keyof IRegisterFields, never>);
    };

    private onChangeSelect = (name: string, index: number, item: UserSex) => {
        this.setState({ [name]: item } as Record<keyof IRegisterFields, never>);
    };

    private onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        this.setState({
            busy: true,
            attention: undefined,
        }, () => {
            const { firstName, lastName, sex, email, password, captcha, login } = this.state;
            const params = { firstName, lastName, sex, email, password, captchaId: captcha, login, v: 250 };

            api<true>('account.create', params)
                .then(() => {
                    this.setState({
                        attention: {
                            type: 'info',
                            text: 'Вы успешно зарегистрировались. На указанный email отправлено письмо ссылкой активации.',
                        },
                    });
                })
                .catch((e: Error) => {
                    this.setState({
                        attention: {
                            type: 'error',
                            text: e.message,
                        },
                        busy: false
                    });
                });
        });
    };

    private onVerify = (captcha: string) => this.setState({ captcha });
    private onExpire = () => this.setState({ captcha: undefined });

    render() {
        if (this.state.wait) {
            return <LoadingWrapper loading />;
        }

        const { busy, firstName, lastName, sex, password, login, email, captcha, attention } = this.state;

        return (
            <form className="settings-form" onSubmit={this.onSubmit}>
                <h2>Регистрация</h2>
                <TextInput
                    type={TextInputType.text}
                    name="firstName"
                    label="Имя"
                    value={firstName}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type={TextInputType.text}
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
                    type={TextInputType.text}
                    name="login"
                    label="Логин"
                    value={login}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type={TextInputType.email}
                    name="email"
                    label="E-mail"
                    value={email}
                    onChange={this.onChange}
                    required
                    disabled={busy} />
                <TextInput
                    type={TextInputType.password}
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
                        type={attention.type}
                        show={attention !== undefined}
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

export default withRouter(withSessionListener(Register));
