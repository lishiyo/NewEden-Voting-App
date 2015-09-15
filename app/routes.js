import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import Character from './components/Character';

export default (
    <Route handler={App}>
        <DefaultRoute name="home" handler={Home} />
        <Route name="add" path="add" handler={AddCharacter} />
        <Route name="characterDetail" path='/characters/:id' handler={Character} />
    </Route>
);
