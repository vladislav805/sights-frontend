import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoadingWrapper from '../../components/LoadingWrapper';
import Random from './Random';
const Search = React.lazy(() => import(/* webpackChunkName: 'page.sight.search' */ './Search'));
const MapPage = React.lazy(() => import(/* webpackChunkName: 'page.sight.map' */ './Map'));
const SightEntry = React.lazy(() => import(/* webpackChunkName: 'page.sight.entry' */ './Entry'));
const SightEdit = React.lazy(() => import(/* webpackChunkName: 'page.sight.edit' */ './Edit'));

const SightRoute: React.FC = () => (
    <React.Suspense fallback={<LoadingWrapper loading />}>
        <Switch>
            <Route path="/sight/random" exact component={Random} />
            <Route path="/sight/search" exact component={Search} />
            <Route path="/sight/map" exact component={MapPage} />
            <Route path="/sight/new" exact component={SightEdit} />
            <Route path="/sight/:id/edit" component={SightEdit} />
            <Route path="/sight/:id" component={SightEntry} />
        </Switch>
    </React.Suspense>
);

export default SightRoute;
