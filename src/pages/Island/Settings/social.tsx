import * as React from 'react';
import './style.scss';
import './social.scss';
import PageTitle from '../../../components/PageTitle';
import API from '../../../api';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TelegramLoginButton, { TelegramUser } from 'react-telegram-login';
import Button from '../../../components/Button';
import VkLoginButton from '../../../components/VkLoginButton';
import Config from '../../../config';
import { VK } from '../../../utils/vk/open-api';
import * as Modal from '../../../components/Modal';
import { withWaitCurrentUser } from '../../../hoc/withWaitCurrentUser';

type ISocialConnections = {
    direct: boolean;
    telegramId: number;
    vkId: number;
};

const Social: React.FC = () => {
    const [busy, setBusy] = React.useState<boolean>(false);
    const [connections, setConnections] = React.useState<ISocialConnections>(null);

    React.useEffect(() => {
        void API.account.getSocialConnections().then(setConnections);
    }, []);

    const { connectTelegram, disconnectTelegram, connectVk, disconnectVk } = React.useMemo(() => {
        return {
            connectTelegram: (user: TelegramUser) => {
                setBusy(true);
                void API.account.setSocialConnection({ social: 'telegram', data: JSON.stringify(user) })
                    .then(() => {
                        setBusy(false);
                        setConnections({ ...connections, telegramId: user.id });
                    });
            },
            disconnectTelegram: () => {
                setBusy(true);
                void API.account.setSocialConnection({ social: 'telegram', data: 0 })
                    .then(() => {
                        setBusy(false);
                        setConnections({ ...connections, telegramId: null });
                    });
            },
            connectVk: (user: VK.OnAuthUserData) => {
                setBusy(true);
                void API.account.setSocialConnection({ social: 'vk', data: JSON.stringify(user) })
                    .then(() => {
                        setBusy(false);
                        setConnections({ ...connections, vkId: user.uid });
                    });
            },
            disconnectVk: () => {
                setBusy(true);
                void API.account.setSocialConnection({ social: 'vk', data: 0 })
                    .then(() => {
                        setBusy(false);
                        setConnections({ ...connections, vkId: null });
                    });
            },
        };
    }, [connections]);

    if (!connections) {
        return <LoadingSpinner block subtitle="Получение информации о связках..." />
    }

    return (
        <div className="settings-form">
            <PageTitle>Способы входа</PageTitle>
            <p>Для быстрого входа и интеграции с Telegram и VK, Вы можете связать этот аккаунт с аккаунтами в этих сервисах.</p>
            <div className="social-table">
                <div className="social-item">
                    <div className="social-name">По паролю</div>
                    <div className="social-value">{connections.direct ? 'подключен' : '*пока не реализовано подключение*'}</div>
                </div>
                <div className="social-item">
                    <div className="social-name">Telegram</div>
                    <div className="social-value">
                        {connections.telegramId
                            ? (
                                <>
                                    <p>id{connections.telegramId}</p>
                                    <Button
                                        label="Отвязать"
                                        onClick={disconnectTelegram} />
                                </>
                            )
                            : (
                                <TelegramLoginButton
                                    lang="ru"
                                    usePic={false}
                                    botName="SightsMapBot"
                                    buttonSize="medium"
                                    dataOnauth={connectTelegram} />
                            )
                        }
                    </div>
                </div>
                <div className="social-item">
                    <div className="social-name">VK</div>
                    <div className="social-value">
                        {connections.vkId
                            ? (
                                <>
                                    <p>id{connections.vkId}</p>
                                    <Button
                                        label="Отвязать"
                                        onClick={disconnectVk} />
                                </>
                            )
                            : (
                                <VkLoginButton
                                    clientId={Config.THIRD_PARTY.VK.API_ID}
                                    onAuthorized={connectVk} />
                            )
                        }
                    </div>
                </div>
            </div>
            <Modal.Window
                show={busy}>
                <Modal.Title>Подождите...</Modal.Title>
                <Modal.Content>
                    <LoadingSpinner block size="l" />
                </Modal.Content>
            </Modal.Window>
        </div>
    );
};

export default withWaitCurrentUser(Social);
