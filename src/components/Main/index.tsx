import * as React from 'react';
import './style.scss';
import { Route, Switch } from 'react-router-dom';
import Sight from '../../pages/Sight';
import Island from '../../pages/Island';
import Menu from '../Menu';
import NotFound from '../../pages/NotFound';
// import Notification from '../../pages/Notifications';
import LoadingSpinner from '../LoadingSpinner';
import type { IUserProps } from '../../pages/User';

const Home = React.lazy(() => import(/* webpackChunkName: 'page.home' */ '../../pages/Home'));
const User = React.lazy(() => import(/* webpackChunkName: 'page.user' */'../../pages/User'));
const Feed = React.lazy(() => import(/* webpackChunkName: 'page.feed' */'../../pages/Feed'));
const Page = React.lazy(() => import(/* webpackChunkName: 'page.pages' */'../../pages/Page'));

type IMenuProps = {
    menu: boolean;
    closeMenu: () => void;
};

/**
 * Костыли с рендерами вместо component необходимы для корректного свича
 * @see https://github.com/ReactTraining/react-router/issues/4578
 */
const Main: React.FC<IMenuProps> = ({ menu, closeMenu }: IMenuProps) => (
    <div className="main">
        <div className="main-container">
            <Menu isOpen={menu} close={closeMenu} />
            <main>
                <React.Suspense fallback={<LoadingSpinner block />}>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={Home} />
                        <Route
                            path="/user/:username"
                            render={(props: IUserProps) => (
                                <User key={`user${props.match.params.username}`} {...props} />
                            )} />
                        <Route
                            path="/sight"
                            component={Sight} />
                        <Route
                            path="/island"
                            component={Island} />
                        <Route
                            path="/feed"
                            component={Feed} />
                        {/*<Route
                            path="/notifications"
                            component={Notification} />*/}
                        <Route
                            path="/page/:id"
                            component={Page} />
                        <Route
                            component={NotFound} />
                    </Switch>
                </React.Suspense>
            </main>
        </div>
    </div>
);

export default Main;
