import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../NotFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import Activation from './Activation';

const Login = React.lazy(() => import(/* webpackChunkName: 'island.login' */ './Login'));
const Register = React.lazy(() => import(/* webpackChunkName: 'island.register' */ './Register'));
const Settings = React.lazy(() => import(/* webpackChunkName: 'island.settings' */ './Settings'));
const Logout = React.lazy(() => import(/* webpackChunkName: 'island.logout' */ './Logout'));

const Island: React.FC = () => (
    <React.Suspense fallback={<LoadingSpinner block />}>
        <Switch>
            <Route path="/island/login" component={Login} />
            <Route path="/island/register" component={Register} />
            <Route path="/island/settings" component={Settings} />
            <Route path="/island/logout" component={Logout} />
            <Route path="/island/activation" component={Activation} />
            <Route component={NotFound} />
        </Switch>
    </React.Suspense>
);

export default Island;
