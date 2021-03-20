import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextInput from '../TextInput';
import Button from '../Button';
import AttentionBlock from '../AttentionBlock';
import { setSession, TypeOfConnect } from '../../redux';
import API, { setAuthKey } from '../../api';
import { SKL_AUTH_KEY } from '../../config';
import { IApiError } from '../../api/types/base';
import { setCookie } from '../../utils/cookie';

const withStore = connect(
    () => ({}),
    { setSession },
);

type IAuthorizeFormProps = TypeOfConnect<typeof withStore>;

const AuthorizeForm: React.FC<IAuthorizeFormProps> = ({ setSession }: IAuthorizeFormProps) => {
    const [login, setLogin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [busy, setBusy] = React.useState(false);
    const [error, setError] = React.useState<IApiError>(null);
    const history = useHistory();

    const assoc: Record<string, React.Dispatch<React.SetStateAction<string>>> = {
        login: setLogin,
        password: setPassword,
    };

    const onChange = (name: string, value: string) => assoc[name]?.(value);

    const onSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setBusy(true);

        try {
            const { authKey, user } = await API.account.authorize({ login, password });

            setSession(authKey, user); // Redux
            setAuthKey(authKey); // API client
            setCookie(SKL_AUTH_KEY, authKey); // Store
            history.replace(`/user/${user.login}`);
        } catch (e) {
            setError(e);
            console.log(e);
        } finally {
            setBusy(false);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <TextInput
                type="text"
                name="login"
                value={login}
                required
                disabled={busy}
                onChange={onChange}
                label="Логин" />
            <TextInput
                type="password"
                name="password"
                value={password}
                required
                disabled={busy}
                onChange={onChange}
                label="Пароль" />
            <Button
                label="Вход"
                color="primary"
                type="submit"
                loading={busy}
                size="m" />
            <AttentionBlock
                show={error !== null}
                type="error"
                text={() => `Ошибка: ${error.message}`} />
        </form>
    );
};

export default withStore(AuthorizeForm);
