import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Settings from './Settings';
import Logout from './Logout';

const Island = () => (
    <Switch>
        <Route path="/island/login" component={Login} />
        <Route path="/island/register" component={Register} />
        <Route path="/island/settings" component={Settings} />
        <Route path="/island/logout" component={Logout} />
    </Switch>
);

export default Island;
