import * as React from 'react';
import './style.scss';
import { Switch, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import User from '../../pages/User';
import Sight from '../../pages/Sight';
import Island from '../../pages/Island';
import Feed from '../../pages/Feed';
import Page from '../../pages/Page';
import Menu from '../Menu';

type IMenuProps = {
    menu: boolean;
    closeMenu: () => void;
};

const Main = ({ menu, closeMenu }: IMenuProps) => (
    <div className="main">
        <div className="main-container">
            <Menu isOpen={menu} close={closeMenu} />
            <main>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/user/:username" component={User} />
                    <Route path="/sight" component={Sight} />
                    <Route path="/island" component={Island} />
                    <Route path="/feed" component={Feed} />
                    <Route path="/page/:id" component={Page} />
                </Switch>
            </main>
        </div>
    </div>
);

export default Main;
