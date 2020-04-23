import * as React from 'react';
import './style.scss';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TextInput, { TextInputType } from '../TextInput';
import Button from '../Button';
import AttentionBlock from '../AttentionBlock';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import API, { IApiError, setAuthKey } from '../../api';
import Config from '../../config';
import { stringifyQueryString } from '../../utils/qs';
import Icon from '@mdi/react';
import { mdiVk } from '@mdi/js';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type IAuthorizeForm = TypeOfConnect<typeof storeEnhancer>;

/* eslint-disable @typescript-eslint/camelcase */
const getVkAuthUrl = () => {
    const { clientId, redirectUri, apiVersion, scope } = Config.vk;
    return 'https://oauth.vk.com/authorize?' + stringifyQueryString({
        client_id: clientId,
        display: 'page',
        redirect_uri: redirectUri,
        scope,
        response_type: 'code',
        v: apiVersion,
    });
};
/* eslint-enable @typescript-eslint/camelcase */

const AuthorizeForm = ({ setSession }: IAuthorizeForm) => {
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
            const { authKey, user } = await API.users.getAuthKey(login, password);

            setSession(authKey, user); // Redux
            setAuthKey(authKey); // API client
            localStorage.setItem(Config.SKL_AUTH_KEY, authKey); // Store
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
            <a className="authorize--link-vk" href={getVkAuthUrl()}><Icon path={mdiVk} size={1} /> Войти через ВКонтакте<br />(не работает для новых пользователей)</a>
        </form>
    )
};

export default storeEnhancer(AuthorizeForm);
