// ==== Core Node.js modules — path, querystring, http. ====
let path = require('path');
let logger = require('morgan');
let bodyParser = require('body-parser');
let async = require('async');
let request = require('request'); // HTTP requests to the EVE Online API
let _ = require('underscore');

// ==== Third-party NPM libraries — mongoose, express, request. ====
let express = require('express');
let mongoose = require('mongoose');
let swig  = require('swig');
let React = require('react');
let Router = require('react-router');
let xml2js = require('xml2js');
let Promisifier = require("bluebird");

// ==== Application: Config =====
let config = require('./config');
let clientRoutes = require('./app/routes');
let serverRoutes = require('./server/routes');

// ==== Application: MODELS =====
let Character = require('./server/models/character');

// ==== Application: CONTROLLERS =====
let app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Establish a connection pool with MongoDB when we start the Express app
mongoose.connect(config.database);
mongoose.connection.on('error', function() {
  console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?');
});

/**
 * Server Routes - namespaced under `/api`
 */
app.use( '/api', serverRoutes );

/**
 * Client routes with React-router
 * This middleware function will be executed on every req to the server.
 * On the server a rendered HTML markup is sent to index.html where it is inserted into <div id="app">{{ html|safe }}</div>
 */

app.use(function(req, res) {
  Router.run(clientRoutes, req.path, function(Handler) {
    let html = React.renderToString(React.createElement(Handler));
    let page = swig.renderFile('views/index.html', { html: html });

    res.send(page);
  });
});

/**
 * Socket.io server.
 */
let server = require('http').createServer(app);
let io = require('socket.io')(server); // instantiate io from server
let onlineUsers = 0;

io.sockets.on('connection', function(socket) {
  // when a websocket connects, increase user count
  onlineUsers++;

  io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });

  socket.on('disconnect', function() {
    onlineUsers--;
    io.sockets.emit('onlineUsers', { onlineUsers: onlineUsers });
  });
});

server.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
