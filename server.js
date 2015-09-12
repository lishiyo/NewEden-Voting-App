// ==== Core Node.js modules — path, querystring, http. ====
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var async = require('async');
var request = require('request'); // HTTP requests to the EVE Online API
var _ = require('underscore');

// ==== Third-party NPM libraries — mongoose, express, request. ====
var express = require('express');
var mongoose = require('mongoose');
var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var xml2js = require('xml2js');

// ==== Application: config =====
var config = require('./config');
var routes = require('./app/routes');

// ==== Application: MODELS =====
var Character = require('./models/character');

// ==== Application: CONTROLLERS =====


var app = express();

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
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {
    var gender = req.body.gender;
    var characterName = req.body.name;
    var characterIdLookupUrl = config.URL_BASE_CHARACTERS + characterName;

    var parser = new xml2js.Parser();
    // Runs array of function in series, each passing their results to the next in the array
    // However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error.
    async.waterfall([
        // 1 - lookup character in Eve API, if not already in mongo database then pass characterId
        function(callback) {
            request.get(characterIdLookupUrl, function(err, request, xml) {
                if (err) return next(err);
                // attempt to parse XML
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return next(err);
                    try {
                        var characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;
                        Character.findOne({ characterId: characterId }, function(err, character){
                            if (err) return next(err);
                            if (character) {
                                return res.status(409).send({
                                    message: character.name + " is already in the database."
                                });
                            }
                            // error, arg1, arg2...
                            callback(err, characterId);
                        });
                    } catch (e) {
                        return res.status(400).send({ message: 'XML Parse Error' });
                    }
                });
            });
        },
        // 2 - save new character with info to mongo database
        function(characterId) {
            var characterInfoUrl = config.URL_BASE_CHARACTER_INFO + characterId;

            request.get({ url: characterInfoUrl }, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return res.send(err);
                    try {
                        var name = parsedXml.eveapi.result[0].characterName[0];
                        var race = parsedXml.eveapi.result[0].race[0];
                        var bloodline = parsedXml.eveapi.result[0].bloodline[0];

                        var character = new Character({
                          characterId: characterId,
                          name: name,
                          race: race,
                          bloodline: bloodline,
                          gender: gender,
                          random: [Math.random(), 0]
                        });

                        character.save(function(err) {
                            if (err) return next(err);
                            res.send({ message: characterName + ' has been added successfully!' });
                        });
                    } catch (e) {
                        res.status(404).send({
                            message: characterName + ' is not a registered citizen of New Eden.'
                        });
                    }
                });
            });
        }
    ], function (err, result) {
        console.log("async callback done: ", err, result); // last function's callback
    });
});

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
app.get('/api/characters', function(req, res, next) {
    let gender = _.sample(['Male', 'Female']); // random gender
    let randomPoint = [ Math.random(), 0 ];

    Character
        .find({
            random: { $near: randomPoint },
            gender: gender,
            voted: false
        })
        // .where('voted', false)
        // .where('gender', gender)
        .limit(2)
        .exec(function (err, characters) {
            if (err) return next(err);

            res.send(characters);
        })

});

// Server routes with React-router
// This middleware fn will be executed on every req to the server
// On the server a rendered HTML markup is sent to index.html where it is inserted into <div id="app">{{ html|safe }}</div>
app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = React.renderToString(React.createElement(Handler));
    var page = swig.renderFile('views/index.html', { html: html });
    res.send(page);
  });
});

/**
 * Socket.io stuff.
 */
var server = require('http').createServer(app);
var io = require('socket.io')(server); // instantiate io from server
var onlineUsers = 0;

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
