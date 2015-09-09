import React from 'react';
import { RouteHandler } from 'react-router';

class App extends React.Component {
    render() {
        return (
            <div>
                <h3>App!</h3>
                <RouteHandler /> {/* <div ng-view></div> - insert template of current route here*/}
            </div>
        );
    }
}

export default App;
