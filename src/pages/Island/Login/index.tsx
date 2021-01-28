import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { useHistory, useLocation } from 'react-router-dom';
import AttentionBlock from '../../../components/AttentionBlock';
import { parseQueryString } from '../../../utils';
import PageTitle from '../../../components/PageTitle';
import AuthorizeSocial from '../../../components/AuthorizeSocialButtons';
import useCurrentUser from '../../../hook/useCurrentUser';
import { withSessionOnly } from '../../../hoc/withSessionOnly';
import Button from '../../../components/Button';

type IMessage = {
    type: 'info';
    text: string;
};

const messages: Record<string, IMessage> = {
    activation: {
        type: 'info',
        text: 'Активация успешно пройдена. Теперь Вы можете авторизоваться и полноценно пользоваться сервисом. Спасибо!',
    },
};

const Login: React.FC = () => {
    const location = useLocation();
    const history = useHistory();
    const currentUser = useCurrentUser();
    const message = React.useMemo(() => {
        const qs = parseQueryString(location.search).get('from');

        return qs && messages[qs];
    }, [location.search]);

    if (currentUser) {
        history.replace('/');
        return null;
    }

    return (
        <div className="login-container">
            <PageTitle>Авторизация</PageTitle>
            <h1>Авторизация</h1>
            {message && (
                <AttentionBlock
                    type={message.type}
                    show
                    text={message.text} />
            )}
            <AuthorizeForm />
            <h4>Нет аккаунта? Не страшно!</h4>
            <Button
                link="/island/register"
                label="Регистрация" />
            <p>Не хочется создавать кучу аккаунтов? Без проблем!</p>
            <AuthorizeSocial />
        </div>
    );
}

export default withSessionOnly(Login, false);
