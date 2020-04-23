import { RouteProps } from 'react-router';
import { lazyComponent, lazyComponentBabel } from './components/Lazy';
import * as React from 'react';

export enum RouteNames {
    HOME = 'home',
    SIGHT = 'sight',
    NOT_FOUND = 'not_found',
}

export const Routes: Record<RouteNames, RouteProps> = {
    [RouteNames.HOME]: {
        exact: true,
        path: '/',
        component: lazyComponent({
            async asyncLoader() {
                if (typeof window === 'object') {
                    return import(/* webpackChunkName: "page.home" */ './pages/Home');
                }

                return { default: React.Fragment };
            },
            syncLoader() {
                if (typeof window === 'undefined') {
                    return require('./pages/Home');
                }
            },

            id: require.resolveWeak('components/Section/HomeSection/HomeSection'),
        }),
    },

    // This imports will be processed by babel plugin
    [RouteNames.SIGHT]: {
        path: '/sight/:id',

        component: lazyComponentBabel(() =>
            import(/* webpackChunkName: "page.sight-entry" */ './pages/Sight/Entry'),
        ),
    },

    [RouteNames.NOT_FOUND]: {
        component: lazyComponentBabel(() =>
            import(/* webpackChunkName: "page.notFound" */ './pages/NotFound'),
        ),
    },
};
