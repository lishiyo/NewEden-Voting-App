import React from 'react';
import Router from 'react-router';
import routes from './routes';

// Client entry point for app
// React Router bootstraps the routes from routes.js file, matches them against a URL, and then executes the appropriate callback handler
// If on "/" path, then render Home as defined in `routes.js`
Router.run(routes, Router.HistoryLocation, (Handler) => {
    React.render(<Handler />, document.getElementById('app'));
});
