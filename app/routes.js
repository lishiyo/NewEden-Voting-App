import React from 'react';
import {Route, DefaultRoute} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import AddCharacter from './components/AddCharacter';
import Stats from './components/Stats';
import Character from './components/Character';
import CharacterList from './components/CharacterList';

export default (
    <Route handler={App}>
        <DefaultRoute name="home" handler={Home} />
        <Route name="add" path="add" handler={AddCharacter} />
        <Route name="characterDetail" path='/characters/:id' handler={Character} />
        <Route name="stats" path='/stats' handler={Stats} />
        {/** needs to be last - handles /shame, /top, /top/race/bloodline **/}
        <Route name="characterList" path=':category' handler={CharacterList}>
          <Route path=':race' handler={CharacterList}>
            <Route path=':bloodline' handler={CharacterList} />
          </Route>
        </Route>
    </Route>
);
