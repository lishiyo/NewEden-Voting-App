import React from 'react';
import { RouteHandler } from 'react-router';
import Footer from './Footer';

class App extends React.Component {
    render() {
        return (
            <div>
                <h3>App!</h3>
                <RouteHandler />
                <Footer />
            </div>
        );
    }
}

export default App;
