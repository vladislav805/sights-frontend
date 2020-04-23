import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadingWrapper from '../../components/LoadingWrapper';
const Login = React.lazy(() => import(/* webpackChunkName: 'island.login' */ './Login'));
const Register = React.lazy(() => import(/* webpackChunkName: 'island.register' */ './Register'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'island.settings' */ './Settings'));
const Logout = React.lazy(() => import(/* webpackChunkName: 'island.logout' */ './Logout'));

const Island = () => (
    <React.Suspense fallback={<LoadingWrapper loading />}>
        <Switch>
            <Route path="/island/login" component={Login} />
            <Route path="/island/register" component={Register} />
            <Route path="/island/settings" component={Settings} />
            <Route path="/island/logout" component={Logout} />
        </Switch>
    </React.Suspense>
);

export default Island;
