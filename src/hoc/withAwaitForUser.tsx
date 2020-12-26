import * as React from 'react';
import { addSessionResolveListener, IWithSessionListener, SessionResolveListener } from './utils-session-resolver';
import { IUser } from '../api/types/user';
import LoadingSpinner from '../components/LoadingSpinner';
import withSpinnerWrapper from '../components/LoadingSpinner/wrapper';

export type IComponentWithUserProps = {
    currentUser?: IUser;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function withAwaitForUser<T extends IComponentWithUserProps>(Child: React.ComponentType<T>) {
    type IState = {
        wait: boolean;
        user?: IUser;
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return class extends React.Component<T & IWithSessionListener> {
        static displayName = `withAwaitForUser(${Child.displayName || Child.name})`;

        state: IState = {
            wait: true,
        };

        public componentDidMount() {
            void addSessionResolveListener().then(this.onSessionResolved);
        }

        private onSessionResolved: SessionResolveListener = user => {
            this.setState({ wait: false, user });
        };

        render = () => {
            return this.state.wait
                ? withSpinnerWrapper(<LoadingSpinner />, 'Ожидание сессии...')
                : <Child {...this.props} currentUser={this.state.user} />;
        }
    };
}
