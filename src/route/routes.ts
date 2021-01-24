import * as React from 'react';
import type { RouteProps } from 'react-router';
import type { RouteComponentProps } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

const UserPage = React.lazy(() => import(/* webpackChunkName: 'b.user' */ '../pages/User'));

const SightMapPage = React.lazy(() => import(/* webpackChunkName: 'b.sight.map' */ '../pages/Sight/Map'))
const SightViewPage = React.lazy(() => import(/* webpackChunkName: 'b.sight.entry' */ '../pages/Sight/Entry'));
const SightEditPage = React.lazy(() => import(/* webpackChunkName: 'b.sight.edit' */ '../pages/Sight/Edit'));
const SightSearchPage = React.lazy(() => import(/* webpackChunkName: 'b.sight.search' */ '../pages/Sight/Search'));

const CollectionListPage = React.lazy(() => import(/* webpackChunkName: 'b.collection.list' */ '../pages/Collection/List'));

const LoginPage = React.lazy(() => import(/* webpackChunkName: 'b.island.login' */ '../pages/Island/Login'));
const LogoutPage = React.lazy(() => import(/* webpackChunkName: 'b.island.logout' */ '../pages/Island/Logout'));
const ActivationPage = React.lazy(() => import(/* webpackChunkName: 'b.island.activation' */ '../pages/Island/Activation'));
const RegisterPage = React.lazy(() => import(/* webpackChunkName: 'b.island.register' */ '../pages/Island/Register'));

const MdPage = React.lazy(() => import(/* webpackChunkName: 'b.pages' */ '../pages/Page'));
const SettingsPage = React.lazy(() => import(/* webpackChunkName: 'b.settings' */ '../pages/Island/Settings'))

const FeedPage = React.lazy(() => import(/* webpackChunkName: 'b.feed' */ '../pages/Feed'));

type RouteItem = RouteProps & {
    key: string;
};

export const routes: RouteItem[] = [
    {
        key: 'home',
        exact: true,
        path: '/',
        component: Home,
    },
    {
        key: 'sight/map',
        path: '/sight/map',
        component: SightMapPage,
    },
    {
        key: 'sight/search',
        path: '/sight/search',
        component: SightSearchPage,
    },
    {
        key: 'sight/new',
        path: '/sight/new',
        render(props: RouteComponentProps<{ id: string }>): JSX.Element {
            return React.createElement(SightEditPage, {
                ...props,
                key: `sight_edit_new`,
            });
        },
    },
    {
        key: 'sight/id/edit',
        path: '/sight/:id(\\d+)/edit',
        render(props: RouteComponentProps<{ id: string }>): JSX.Element {
            return React.createElement(SightEditPage, {
                ...props,
                key: `sight_edit_${props.match.params.id}`,
            });
        },
    },
    {
        key: 'sight/id',
        path: '/sight/:id(\\d+)',
        render(props: RouteComponentProps<{ id: string }>): JSX.Element {
            return React.createElement(SightViewPage, {
                ...props,
                key: `sight_${props.match.params.id}`,
            });
        },
    },
    {
        key: 'user/id',
        path: '/user/:username',
        render(props: RouteComponentProps<{ username: string }>): JSX.Element {
            return React.createElement(UserPage, {
                ...props,
                key: `user_${props.match.params.username}`,
            });
        },
    },
    {
        key: 'collections',
        path: ['/collections/:ownerId(\\d+)', '/collections'],
        render(props: RouteComponentProps<{ ownerId: string }>): JSX.Element {
            return React.createElement(CollectionListPage, {
                ...props,
                key: `collections_${props?.match?.params?.ownerId}`,
            });
        }
    },
    {
        key: 'island/settings',
        path: '/island/settings',
        component: SettingsPage,
    },
    {
        key: 'island/logout',
        exact: true,
        path: '/island/logout',
        component: LogoutPage,
    },
    {
        key: 'island/login',
        exact: true,
        path: '/island/login',
        component: LoginPage,
    },
    {
        key: 'island/register',
        exact: true,
        path: '/island/register',
        component: RegisterPage,
    },
    {
        key: 'island/activation',
        path: '/island/activation',
        component: ActivationPage,
    },
    {
        key: 'feed',
        exact: true,
        path: '/feed',
        component: FeedPage,
    },
    {
        key: 'pages',
        path: '/page/:id',
        render(props: RouteComponentProps<{ id: string }>): JSX.Element {
            return React.createElement(MdPage, {
                ...props,
                key: `page_${props.match.params.id}`,
            });
        },
    },
    // {}, notifications
    {
        key: '404',
        component: NotFound,
    },
];
