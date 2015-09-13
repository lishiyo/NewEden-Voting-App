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
    let genders = ['Male', 'Female'];
    let randomGender = _.sample(genders); // random gender

    Character
        .find({
            random: { $near: [ Math.random(), 0 ] },
            gender: randomGender,
            voted: false
        })
        .limit(2)
        .exec(function (err, characters) {
            if (err) return next(err);

            // if we got two, we're done
            if (characters.length === 2) {
              return res.send(characters);
            }

            // otherwise, try the opposite gender
            let oppositeGender = _.first(_.without(genders, randomGender));

            Character
              .find({ random: { $near: [ Math.random(), 0 ] }})
              .where('voted', false)
              .where('gender', oppositeGender)
              .exec(function (err, characters) {
                if (err) return next(err);

                if (characters.length === 2) {
                  return res.send(characters);
                }

                // reset all characters to have not been voted before, with multiple allowed
                Character.update({}, { $set: { voted: false } }, { multi: true }, function(err) {
                  if (err) return next(err);
                  res.send([]);
                });
              });
        });
});

/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
app.put('/api/characters', function(req, res, next) {
  let winnerId = req.body.winnerId;
  let loserId = req.body.loserId;

  if (!winnerId || !loserId) {
    return res.status(400).send({ message: 'Voting requires two characters.' });
  }

  if (winnerId === loserId) {
    return res.status(400).send({ message: 'Cannot vote for and against the same character.' });
  }

  async.parallel({
    findWinner: function(callback) {
      Character.findOne( { characterId: winnerId }, function(err, winner) {
        callback(err, winner);
      });
    },
    findLoser: function(callback) {
      Character.findOne( { characterId: loserId }, function(err, loser) {
        callback(err, loser);
      });
    },
  },
  function(err, results) {
      // results is now: {findWinner: winner, findLoser: loser}
      if (err) return next(err);
      let winner = results.findWinner;
      let loser = results.findLoser;

      if (!winner || !loser) {
        return res.status(404).send( { message: 'A character no longer exists.'});
      }

      if (winner.voted || loser.voted) {
        return res.status(200).end();
      }

      async.parallel([
        function(callback) {
          winner.wins++;
          winner.voted = true;
          winner.random = [Math.random(), 0];
          winner.save(function(err, winner) {
            callback(err);
          });
        },
        function(callback) {
          loser.losses++;
          loser.voted = true;
          loser.random = [Math.random(), 0];
          loser.save(function(err, loser) {
            callback(err);
          });
        }
      ], function(err) {
        if (err) return next(err);

        res.status(200).end();
      });
  });
});

/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
app.get('/api/characters/count', function(req, res, next) {
  Character.count({}, function(err, count) {
    if (err) return next(err);

    res.send( { count: count });
  })
});

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
app.get('/api/characters/search', function(req, res, next){
  let name = new RegExp(req.query.name, 'i');

  Character.findOne({ name: name }, function(err, character) {
    if (err) return next(err);
    if (!character) {
      return res.status(404).send( { message: "Couldn't find character."});
    }

    res.send({ character: character });
  });
});

/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
app.get('/api/characters/:id', function(req, res, next) {
 var id = req.params.id;

 Character.findOne({ characterId: id }, function(err, character) {
   if (err) return next(err);

   if (!character) {
     return res.status(404).send({ message: 'Character not found.' });
   }

   res.send(character);
 });
});

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
  console.log("top", req.query);
  // GET /api/characters/top?race=caldari&bloodline=civire&gender=male
  let params = req.query; // { race: caldari, bloodline: civire }
  let conditions = {}; // /caldari$/i, // /civire$/i, // /male$/i
  // { race: /caldari$/i, bloodline: /civire$/i, gender: /male$/i }
  _.each(params, function(value, key) { // value, key, list
    let valueRegex = '^' + value + '$';
    conditions[key] = new RegExp(valueRegex, 'i');
  });

  Character
  .find(conditions)
  .sort('-wins') // descending wins order
  .limit(100)
  .exec(function(err, characters) {
    if (err) return next(err);
    characters.sort(function(a, b) {
      let aPct = a.winningPercentage();
      let bPct = b.winningPercentage();
      console.log("a vs b", a, b);
      if (aPct > bPct) {
        return -1;
      } else if (aPct < bPct) {
        return 1;
      } else return 0;
    });

    res.send(characters);
  });
});


// Server routes with React-router
// This middleware function will be executed on every req to the server
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
