import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Random from './Random';
import Search from './Search';
import MapPage from './Map';
import SightEntry from './Entry';
import SightEdit from './Edit';

const SightRoute = () => (
    <Switch>
        <Route path="/sight/random" component={Random} />
        <Route path="/sight/search" component={Search} />
        <Route path="/sight/map" component={MapPage} />
        <Route path="/sight/new" component={SightEdit} />
        <Route path="/sight/:id/edit" component={SightEdit} />
        <Route path="/sight/:id" component={SightEntry} />
    </Switch>
);

export default SightRoute;
