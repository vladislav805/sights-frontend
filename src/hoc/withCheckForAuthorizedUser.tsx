import * as React from 'react';
import { addSessionResolveListener, IWithSessionListener, SessionResolveListener } from './utils-session-resolver';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { IUser } from '../api/types/user';

type IWithCheckForAuthorizedUserProps = {
    needUser?: boolean;
    targetUri?: string;
};

type IComponentWithUserProps = React.ComponentType & {
    currentUser?: IUser;
};

export function withCheckForAuthorizedUser<T extends IComponentWithUserProps>(
    Child: React.ComponentType<T>,
    {
        needUser = true,
        targetUri = '/'
    }: IWithCheckForAuthorizedUserProps = {}
) {
    type IProps = T & IWithSessionListener & RouteComponentProps<never>;
    type IState = {
        wait: boolean;
        user?: IUser;
    };

    const Component = class extends React.Component<IProps> {
        static displayName = `withCheckForAuthorizedUser(${Child.displayName || Child.name})`;

        state: IState = {
            wait: true,
        };

        public componentDidMount() {
            void addSessionResolveListener().then(this.onSessionResolved);
        }

        private onSessionResolved: SessionResolveListener = user => {
            if (Boolean(user) === needUser) {
                this.setState({ wait: false, user });
            } else {
                this.props.history.replace(targetUri);
            }
        };

        render = () => {
            return this.state.wait
                ? <LoadingSpinner block />
                : <Child {...this.props} currentUser={this.state.user} />;
        }
    };

    return withRouter(Component);
}
