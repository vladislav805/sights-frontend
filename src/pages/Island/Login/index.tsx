import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import AttentionBlock from '../../../components/AttentionBlock';
import { parseQueryString } from '../../../utils';
import PageTitle from '../../../components/PageTitle';
import AuthorizeSocial from '../../../components/AuthorizeSocialButtons';
import { withWaitCurrentUser } from '../../../hoc/withWaitCurrentUser';

type ILoginProps = RouteComponentProps<never>;

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

const Login: React.FC<ILoginProps> = (props: ILoginProps) => {
    const message = React.useMemo(() => {
        const qs = parseQueryString(props.location.search).get('from');

        return qs && messages[qs];
    }, [props.location.search]);

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
            <Link to="/island/register" className="xButton xButton__primary">Регистрация</Link>
            <p>Не хочется создавать кучу аккаунтов? Без проблем!</p>
            <AuthorizeSocial />
        </div>
    );
}

export default withWaitCurrentUser(withRouter(Login), {
    needUser: false,
});
