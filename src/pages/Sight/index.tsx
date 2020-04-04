import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import SightEntry from './Entry';
import SightEdit from './Edit';

const SightRoute = () => (
    <Switch>
        <Route path="/sight/:id/edit" component={SightEdit} />
        <Route path="/sight/:id" component={SightEntry} />
    </Switch>
);

export default SightRoute;
