import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { IWithSessionListener, withSessionListener } from '../../../session/withSessionListener';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionResolveListener } from '../../../session';
import LoadingWrapper from '../../../components/LoadingWrapper';
import AttentionBlock from '../../../components/AttentionBlock';
import { parseQueryString } from '../../../utils/qs';

type ILoginProps = IWithSessionListener & RouteComponentProps<never>;

type ILoginState = {
    wait: boolean;
    message?: {
        type: 'info';
        text: string;
    };
};

class Login extends React.Component<ILoginProps> {
    state: ILoginState = {
        wait: true,
    };

    componentDidMount() {
        this.props.onSessionResolved(this.onSessionResolved);

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

    private onSessionResolved: SessionResolveListener = user => {
        if (user) {
            this.props.history.replace('/');
        } else {
            this.setState({ wait: false });
        }
    };

    render() {
        const { wait, message } = this.state;
        return (
            <LoadingWrapper
                loading={wait}
                render={() => (
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
                )} />
        );
    }
}

export default withRouter(withSessionListener(Login));
