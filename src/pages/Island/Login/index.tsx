import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import AttentionBlock from '../../../components/AttentionBlock';
import { parseQueryString } from '../../../utils';
import { withCheckForAuthorizedUser } from '../../../hoc';
import PageTitle from '../../../components/PageTitle';

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
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default withCheckForAuthorizedUser(withRouter(Login), {
    needUser: false,
});
