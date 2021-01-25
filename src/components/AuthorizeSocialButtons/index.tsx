import * as React from 'react';
import './style.scss';
import API, { setAuthKey } from '../../api';
import TelegramLoginButton, { TelegramUser } from 'react-telegram-login';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setSession, TypeOfConnect } from '../../redux';
import Config, { SKL_AUTH_KEY } from '../../config';
import * as Modal from '../Modal';
import { delay } from '../../utils';
import VkLoginButton from '../VkLoginButton';
import { VK } from '../../utils/vk/open-api';
import { ISession } from '../../api/types/session';
import { setCookie } from '../../utils/cookie';

const withStore = connect(
    () => ({}),
    { setSession },
);

type IAuthorizeSocialProps = TypeOfConnect<typeof withStore>;

function request(field: 'telegramData', user: TelegramUser): Promise<ISession>;
function request(field: 'vkData', user: VK.OnAuthUserData): Promise<ISession>;
function request(field: 'telegramData' | 'vkData', user: TelegramUser | VK.OnAuthUserData): Promise<ISession> {
    const params = field === 'telegramData'
        ? { telegramData: JSON.stringify(user) }
        : { vkData: JSON.stringify(user) };

    return API.account.create(params);
}

const AuthorizeSocial: React.FC<IAuthorizeSocialProps> = (props: IAuthorizeSocialProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const history = useHistory();

    const onSuccess = React.useMemo(() => (session: ISession) => {
        setBusy(false);

        props.setSession(session.authKey, session.user); // Redux
        setAuthKey(session.authKey); // API client
        setCookie(SKL_AUTH_KEY, session.authKey); // Store

        void delay(200).then(() => history.replace(`/user/${session.user.login}`));
    }, []);

    const onTelegramCreated = (user: TelegramUser): void => {
        setBusy(true);
        void request('telegramData', user)
            .then(onSuccess);
    };

    const onVkCreated = (user: VK.OnAuthUserData): void => {
        setBusy(true);
        void request('vkData', user).then(onSuccess);
    };

    return (
        <div className="authorizeSocial">
            <div>
                <TelegramLoginButton
                    buttonSize="medium"
                    dataOnauth={onTelegramCreated}
                    botName={Config.THIRD_PARTY.Telegram.BOT_USERNAME} />
            </div>
            <div>
                <VkLoginButton
                    width={270}
                    clientId={Config.THIRD_PARTY.VK.API_ID}
                    onAuthorized={onVkCreated} />
            </div>
            <Modal.Window show={busy}>
                <Modal.Title>Ожидание...</Modal.Title>
            </Modal.Window>
        </div>
    );
}

export default withStore(AuthorizeSocial);
