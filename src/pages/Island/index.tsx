import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Edit from './Edit';

const Island = () => (
    <Switch>
        <Route path="/island/login" component={Login} />
        <Route path="/island/register" component={Register} />
        <Route path="/island/edit" component={Edit} />
    </Switch>
);

export default Island;
