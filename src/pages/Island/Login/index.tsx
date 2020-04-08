import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import AttentionBlock from '../../../components/AttentionBlock';
import { parseQueryString } from '../../../utils/qs';
import { withCheckForAuthorizedUser } from '../../../hoc/withCheckForAuthorizedUser';

type ILoginProps = RouteComponentProps<never>;

type ILoginState = {
    message?: {
        type: 'info';
        text: string;
    };
};

class Login extends React.Component<ILoginProps> {
    state: ILoginState = {};

    componentDidMount() {
        const qs = parseQueryString(this.props.location.search);

        if (qs.get('from') === 'activation') {
            this.setState({
                message: {
                    type: 'info',
                    text: 'Активация успешно пройдена. Теперь Вы можете авторизоваться и полноценно пользоваться сервисом. Спасибо!',
                },
            });
        }
    }

    render() {
        const { message } = this.state;
        return (
            <div className="login-container">
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
}

export default withCheckForAuthorizedUser(withRouter(Login), {
    needUser: false,
});
