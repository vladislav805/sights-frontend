import * as React from 'react';
import { ISession, Session } from '../controllers';

export interface WithSessionHoC {
    session?: ISession;
}

function withSession<T>(Child: React.ComponentType<T>) {
    return class extends React.Component<T & WithSessionHoC, WithSessionHoC> {
        static displayName = `withSession(${Child.displayName || Child.name})`;

        constructor(props: T & WithSessionHoC) {
            super(props);

            this.state = {
                session: new Session(),
            };
        }

        private setAuthKey = (authKey: string) => {
            const session = new Session().setAuthKey(authKey);
            this.setState({ session })
        };

        private getProp = () => ({
            ...this.state.session,
            setAuthKey: this.setAuthKey,
        });

        render() {
            return <Child session={this.getProp()} {...this.props} />;
        }
    }
}

export default withSession;
