import * as React from 'react';
import './style.scss';
import AuthorizeForm from '../../../components/AuthorizeForm';
import { IWithSessionListener, withSessionListener } from '../../../session/withSessionListener';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SessionResolveListener } from '../../../session';
import LoadingWrapper from '../../../components/LoadingWrapper';

type ILoginProps = IWithSessionListener & RouteComponentProps<never>;
type ILoginState = {
    wait: boolean;
};

class Login extends React.Component<ILoginProps> {
    state: ILoginState = {
        wait: true,
    };

    componentDidMount() {
        this.props.onSessionResolved(this.onSessionResolved);
    }

    private onSessionResolved: SessionResolveListener = user => {
        if (user) {
            this.props.history.replace('/');
        } else {
            this.setState({ wait: false });
        }
    };

    render() {
        return (
            <LoadingWrapper
                loading={this.state.wait}
                render={() => (
                    <div className="login-container">
                        <h1>Авторизация</h1>
                        <AuthorizeForm />
                    </div>
                )} />
        );
    }
}

export default withRouter(withSessionListener(Login));
