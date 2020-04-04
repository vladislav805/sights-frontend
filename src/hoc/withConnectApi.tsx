import * as React from 'react';
import { ApiInvoker } from '../api';
import { WithSessionHoC } from './withSession';

// Свойства компонента после композиции
export interface WithApiHoC {
    api?: ApiInvoker;
}

function withConnectApi<T>(Child: React.ComponentType<T>) {
    return class extends React.Component<T & WithSessionHoC & WithApiHoC, {}> {
        static displayName = `withConnectApi(${Child.displayName || Child.name})`;

        render() {
            const api: ApiInvoker = (method, props) => {
                props.authKey = this.props.session?.getAuthKey();
                return api(method, props);
            };

            return (
                <Child api={api} {...this.props} />
            );
        }
    }
};

export default withConnectApi;
