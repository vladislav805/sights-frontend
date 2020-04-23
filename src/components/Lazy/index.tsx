import * as React from 'react';
import { RouteComponentProps } from 'react-router';

// TODO
export interface RouterParams {
    id: string;
}

interface LazyModule {
    default: React.ComponentType<RouteComponentProps<RouterParams>>;
}

export type LazyComponentType = React.ComponentType<RouteComponentProps<RouterParams>> & {
    loader(): Promise<LazyModule>;
};

export interface LazyProps {
    asyncLoader(): Promise<LazyModule>;

    syncLoader(): LazyModule | undefined;

    id: string | number;
}

export function lazyComponent({ asyncLoader, syncLoader, id }: LazyProps): LazyComponentType {
    const LazyComponent = (props: RouteComponentProps<RouterParams>) => {
        const componentModule = syncLoader();
        let Component: React.ComponentType<RouteComponentProps<RouterParams>> | undefined;

        // Server
        if (componentModule) {
            Component = componentModule.default;
        } else {
            // Have preloaded module and make component sync
            if (require.cache[id]) {
                // eslint-disable-next-line @typescript-eslint/camelcase
                Component = require.cache[id].exports.default;
            } else {
                Component = React.lazy(asyncLoader);
            }
        }

        if (!Component) {
            throw new Error('Cannot load component');
        }

        return <Component {...props} />;
    };

    LazyComponent.loader = asyncLoader;

    return LazyComponent;
}

export function lazyComponentBabel(loader: (() => Promise<LazyModule>) | LazyProps): LazyComponentType {
    if (typeof loader === 'function') {
        throw new Error('Add lazyComponentBabelPlugin to your babel config');
    }

    return lazyComponent(loader);
}
