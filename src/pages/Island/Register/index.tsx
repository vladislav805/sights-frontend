import * as React from 'react';
import '../Settings/style.scss';
import Reaptcha from 'reaptcha';
import API from '../../../api';
import TextInput from '../../../components/TextInput';
import Select from '../../../components/Select';
import Button from '../../../components/Button';
import { genders } from '../sex';
import AttentionBlock, { IAttentionBlockProps } from '../../../components/AttentionBlock';
import { Sex } from '../../../api/types/user';
import { withSessionOnly } from '../../../hoc/withSessionOnly';

type IRegisterFields = {
    firstName: string;
    lastName: string;
    sex: Sex;
    email: string;
    login: string;
    password: string;
};

const Register: React.FC = () => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const [attention, setAttention] = React.useState<IAttentionBlockProps>();
    const [user, setUser] = React.useState<IRegisterFields>({
        firstName: '',
        lastName: '',
        login: '',
        email: '',
        password: '',
        sex: Sex.NONE,
    });
    const [captchaId, setCaptchaId] = React.useState<string>();

    const onChange = (name: keyof IRegisterFields, value: string) => {
        setUser({ ...user, [name]: value });
    };

    const onChangeSelect = (name: string, item: string) => {
        setUser({ ...user, [name]: item });
    };

    const onSubmit = React.useMemo(() => {
        return (event: React.FormEvent) => {
            event.preventDefault();

            setBusy(true);
            setAttention(undefined);
            void register();
        };
    }, [user]);

    const register = async() => {
        try {
            await API.account.create({ ...user, captchaId });

            setAttention({
                type: 'info',
                text: 'Вы успешно зарегистрировались. На указанный email отправлено письмо ссылкой активации.',
            });
        } catch (e) {
            setAttention({
                type: 'error',
                text: (e as Error).message,
            });
            setBusy(false);
        }
    };

    const onExpire = () => setCaptchaId(undefined);

    return (
        <form
            className="settings-form"
            onSubmit={onSubmit}>
            <h2>Регистрация</h2>
            <TextInput
                type="text"
                name="firstName"
                label="Имя"
                value={user.firstName}
                onChange={onChange}
                required
                disabled={busy} />
            <TextInput
                type="text"
                name="lastName"
                label="Фамилия"
                value={user.lastName}
                onChange={onChange}
                required
                disabled={busy} />
            <Select
                selectedIndex={genders.findIndex(item => item.data === user.sex)}
                name="sex"
                label="Пол"
                onSelect={onChangeSelect}
                items={genders} />
            <TextInput
                type="text"
                name="login"
                label="Логин"
                value={user.login}
                onChange={onChange}
                required
                disabled={busy} />
            <TextInput
                type="email"
                name="email"
                label="E-mail"
                value={user.email}
                onChange={onChange}
                required
                disabled={busy} />
            <TextInput
                type="password"
                name="password"
                label="Пароль"
                value={user.password}
                onChange={onChange}
                required
                disabled={busy} />
            <Reaptcha
                sitekey={process.env.GOOGLE_RECAPTCHA_SITE_KEY}
                onVerify={setCaptchaId}
                onExpire={onExpire}
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
                disabled={!captchaId}
                loading={busy} />
        </form>
    );
}

export default withSessionOnly(Register, false);
