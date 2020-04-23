import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import LoadingWrapper from '../../../components/LoadingWrapper';
import API, { setAuthKey } from '../../../api';
import Config from '../../../config';
import { connect } from 'react-redux';
import { RootStore, setSession, TypeOfConnect } from '../../../redux';
import { parseQueryString } from '../../../utils/qs';
import Icon from '@mdi/react';
import { mdiEmoticonSad } from '@mdi/js';

const storeEnhancer = connect(
    (state: RootStore) => ({ ...state }),
    { setSession },
    null,
    { pure: false },
);

type IVKRouteProps = {
    code: string;
};

type IVKProps = RouteComponentProps<IVKRouteProps> & TypeOfConnect<typeof storeEnhancer>;

enum VkAuthState {
    LOADING,
    EXIST,
    REGISTER
}

interface IVKState {
    stage: VkAuthState;
}

class VK extends React.Component<IVKProps, IVKState> {
    state: IVKState = {
        stage: VkAuthState.LOADING,
    };

    componentDidMount() {
        const qs = parseQueryString(this.props.location.search);
        this.fetchCheck(qs.get('code'));
    }

    private fetchCheck = async(code: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { session, current } = await API.account.checkForVkUser(code);

        if (session) {
            const { authKey, user } = session;
            this.props.setSession(authKey, user); // Redux
            setAuthKey(authKey); // API client
            localStorage.setItem(Config.SKL_AUTH_KEY, authKey); // Store
            this.props.history.replace(`/user/${user.login}`);
            // VkAuthState.EXIST is useless
        } else {
            // небезопасно из-за возможного изменения данных в адресе пользователем
            // this.props.history.replace(`/island/register?${stringifyQueryString(current)}`);
            this.setState({
                stage: VkAuthState.REGISTER,
            });
        }
    }

    render() {
        switch (this.state.stage) {
            case VkAuthState.LOADING: {
                return (
                    <LoadingWrapper loading subtitle="Ожидаем ответ от ВКонтакте..." />
                );
            }

            case VkAuthState.REGISTER: {
                return (<div style={{ textAlign: 'center', margin: '4rem .2rem' }}>
                    <Icon path={mdiEmoticonSad} size={3} style={{ margin: '0 auto' }} />
                    <h3>Авторизация через ВК успешно пройдена, но у Вас не было аккаунта на нашем сайте.</h3>
                    <p>К сожалению, на данный момент нельзя авторизоваться через ВКонтакте без уже существюущего акканута</p>
                    <p>Вы можете зарегистрироваться стандартным способом, либо авторизоваться на <a href="//sights.vlad805.ru/" target="_blank" rel="noopener noreferrer">старой версии сайта</a> и после успешной авторизации там, попробовать зайти здесь.</p>
                </div>);
            }
        }

        return null;
    }

}

export default withRouter(storeEnhancer(VK));
