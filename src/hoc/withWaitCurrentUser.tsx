import * as React from 'react';
import { addSessionResolveListener, IWithSessionListener, SessionResolveListener } from './utils-session-resolver';
import { IUser } from '../api/types/user';
import LoadingSpinner from '../components/LoadingSpinner';
import { RouteComponentProps, withRouter } from 'react-router-dom';

export type IComponentWithUserProps = {
    currentUser?: IUser;
};

type IWaitCurrentUserProps = {
    needUser?: boolean;
    targetUri?: string;
};

export function withWaitCurrentUser<T extends IComponentWithUserProps>(
    Child: React.ComponentType<T>,
    {
        needUser = undefined,
        targetUri = '/',
    }: IWaitCurrentUserProps = {},
): React.ComponentType<T> {
    type IState = {
        wait: boolean;
        user?: IUser;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return withRouter(class extends React.Component<T & IWithSessionListener & RouteComponentProps> {
        static displayName = `withAwaitForUser(${Child.displayName || Child.name})`;

        state: IState = {
            wait: true,
        };

        public componentDidMount() {
            void addSessionResolveListener().then(this.onSessionResolved);
        }

        private onSessionResolved: SessionResolveListener = user => {
            // если не указано, требуется ли юзер
            // или
            // требование (нужно/не нужно) совпадает с наличием юзера
            if (needUser === undefined || Boolean(user) === needUser) {
                // то всё ок
                this.setState({
                    wait: false,
                    user,
                });
            } else {
                // иначе шлём куда надо
                this.props.history.replace(targetUri);
            }
        };

        render = () => {
            return this.state.wait
                ? (
                    <LoadingSpinner
                        block
                        subtitle="Ожидание сессии..." />
                )
                : (
                    <Child
                        {...this.props}
                        currentUser={this.state.user} />
                );
        }
    });
}
