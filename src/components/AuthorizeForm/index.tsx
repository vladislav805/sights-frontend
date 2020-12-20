import * as React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextInput, { TextInputType } from '../TextInput';
import Button from '../Button';
import AttentionBlock from '../AttentionBlock';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import API, { IApiError, setAuthKey } from '../../api';
import { SKL_AUTH_KEY } from '../../config';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type IAuthorizeForm = TypeOfConnect<typeof storeEnhancer>;

const AuthorizeForm: React.FC<IAuthorizeForm> = ({ setSession }: IAuthorizeForm) => {
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
            const { authKey, user } = await API.account.authorize(login, password);

            setSession(authKey, user); // Redux
            setAuthKey(authKey); // API client
            localStorage.setItem(SKL_AUTH_KEY, authKey); // Store
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
                type={TextInputType.text}
                name="login"
                value={login}
                required
                disabled={busy}
                onChange={onChange}
                label="Логин" />
            <TextInput
                type={TextInputType.password}
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
                size='m' />
            <AttentionBlock
                show={error !== null}
                type="error"
                text={() => `Ошибка ${error.errorId}: ${error.message}`} />
        </form>
    )
};

export default storeEnhancer(AuthorizeForm);
