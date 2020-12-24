import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import Random from './Random';
import type { ISightEditProps } from './Edit';
import type { ISightEntryProps } from './Entry';

const Search = React.lazy(() => import(/* webpackChunkName: 'page.sight.search' */ './Search'));
const MapPage = React.lazy(() => import(/* webpackChunkName: 'page.sight.map' */ './Map'));
const SightEntry = React.lazy(() => import(/* webpackChunkName: 'page.sight.entry' */ './Entry'));
const SightEdit = React.lazy(() => import(/* webpackChunkName: 'page.sight.edit' */ './Edit'));

const SightRoute: React.FC = () => (
    <Switch>
        <Route path="/sight/random" exact component={Random} />
        <Route path="/sight/search" exact component={Search} />
        <Route path="/sight/map" exact component={MapPage} />
        <Route
            path="/sight/new"
            exact
            render={(props: ISightEditProps) => (
                <SightEdit
                    key={`new`}
                    {...props} />
            )}
            component={SightEdit} />
        <Route
            path="/sight/:id/edit"
            render={(props: ISightEditProps) => (
                <SightEdit
                    key={`${props.match.params.id}_edit`}
                    {...props} />
            )} />
        <Route
            path="/sight/:id"
            render={(props: ISightEntryProps) => (
                <SightEntry
                    key={`${props.match.params.id}_view`}
                    {...props} />
            )} />
    </Switch>
);

export default SightRoute;
