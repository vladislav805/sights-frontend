import * as React from 'react';
import './style.scss';
import { Switch, Route } from 'react-router-dom';
import Home from '../../pages/Home';
import User from '../../pages/User';
import Sight from '../../pages/Sight';
import Island from '../../pages/Island';
import Feed from '../../pages/Feed';

const Main = () => (
    <main>
        <div className="main-container">
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/user/:username" component={User} />
                <Route path="/sight" component={Sight} />
                <Route path="/island" component={Island} />
                <Route path="/feed" component={Feed} />
            </Switch>
        </div>
    </main>
);

export default Main;
