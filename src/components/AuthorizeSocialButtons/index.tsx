import * as React from 'react';
import './style.scss';
import API, { setAuthKey } from '../../api';
import TelegramLoginButton, { TelegramUser } from 'react-telegram-login';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootStore, setSession, TypeOfConnect } from '../../redux';
import { SKL_AUTH_KEY } from '../../config';
import * as Modal from '../Modal';
import { delay } from '../../utils';

const withStore = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type IAuthorizeSocialProps = TypeOfConnect<typeof withStore>;

const AuthorizeSocial: React.FC<IAuthorizeSocialProps> = (props: IAuthorizeSocialProps) => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const history = useHistory();

    const onTelegramCreated = (user: TelegramUser): void => {
        void API.account.create({
            telegramData: JSON.stringify(user),
        })
            .then(session => {
                setBusy(false);

                props.setSession(session.authKey, session.user); // Redux
                setAuthKey(session.authKey); // API client
                localStorage.setItem(SKL_AUTH_KEY, session.authKey); // Store

                void delay(200).then(() => history.replace(`/user/${session.user.login}`));
            });
    };


    return (
        <div className="authorizeSocial">
            <div onClick={() => setBusy(true)}>
                <TelegramLoginButton
                    buttonSize="medium"
                    dataOnauth={onTelegramCreated}
                    botName="SightsMapBot" />
            </div>
            <Modal.Window show={busy}>
                <Modal.Title>Ожидание...</Modal.Title>
            </Modal.Window>
        </div>
    );
}

export default withStore(AuthorizeSocial);
