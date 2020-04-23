import * as React from 'react';
import './style.scss';
import { Switch, Route } from 'react-router-dom';
const Home = React.lazy(() => import(/* webpackChunkName: 'page.home' */ '../../pages/Home'));
const User = React.lazy(() => import(/* webpackChunkName: 'page.user' */'../../pages/User'));
import Sight from '../../pages/Sight';
import Island from '../../pages/Island';
const Feed = React.lazy(() => import(/* webpackChunkName: 'page.feed' */'../../pages/Feed'));
const Page = React.lazy(() => import(/* webpackChunkName: 'page.pages' */'../../pages/Page'));
import Menu from '../Menu';
import LoadingWrapper from '../LoadingWrapper';

type IMenuProps = {
    menu: boolean;
    closeMenu: () => void;
};

const Main = ({ menu, closeMenu }: IMenuProps) => (
    <div className="main">
        <div className="main-container">
            <Menu isOpen={menu} close={closeMenu} />
            <main>
                <React.Suspense fallback={<LoadingWrapper loading />}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/user/:username" component={User} />
                        <Route path="/sight" component={Sight} />
                        <Route path="/island" component={Island} />
                        <Route path="/feed" component={Feed} />
                        <Route path="/page/:id" component={Page} />
                    </Switch>
                </React.Suspense>
            </main>
        </div>
    </div>
);

export default Main;
