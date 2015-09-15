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

// ==== Application: config =====
let config = require('./config');
let routes = require('./app/routes');

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
 * POST /api/characters
 * Adds new character to the database.
 */
app.post('/api/characters', function(req, res, next) {
    let gender = req.body.gender;
    let characterName = req.body.name;
    let characterIdLookupUrl = config.URL_BASE_CHARACTERS + characterName;

    let parser = new xml2js.Parser();
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
                        let characterId = parsedXml.eveapi.result[0].rowset[0].row[0].$.characterID;
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
            let characterInfoUrl = config.URL_BASE_CHARACTER_INFO + characterId;

            request.get({ url: characterInfoUrl }, function(err, request, xml) {
                if (err) return next(err);
                parser.parseString(xml, function(err, parsedXml) {
                    if (err) return res.send(err);
                    try {
                        let name = parsedXml.eveapi.result[0].characterName[0];
                        let race = parsedXml.eveapi.result[0].race[0];
                        let bloodline = parsedXml.eveapi.result[0].bloodline[0];

                        let character = new Character({
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
 * POST /api/report
 * Reports a character (CharacterActions). Character is removed after 4 reports.
 */
app.post('/api/report', function(req, res, next){
  let characterId = req.body.characterId;

  Character.findOne( { characterId: characterId }, function(err, character) {
    if (err) return next(err);
    if (!character) {
      return res.status(404).send({ message: 'Character not found.' });
    }

    character.reports++;
    if (character.reports >= 4) {
      character.remove();
      return res.send({ message: character.name + ' has been deleted.' });
    }

    character.save(function(err, character) {
      if (err) return next(err);
      return res.send({ message: character.name + ' has been reported.' });
    });
  });
});

/**
 * GET /api/stats
 * Returns characters statistics.
 */
app.get('/api/stats', function(req, res, next) {
  // promises - Promisifier == bluebird
  let countChars = function(condition) {
    return new Promise(function(resolve, reject) {
      Character.count(condition, function(err, charCount) {
        if (err) reject(err);
        resolve(charCount);
      });
    });
  };

  let getAggregateVotes = function() {
    return new Promise(function(resolve, reject) {
      Character.aggregate({
        //  use _id of null to calculate values for all docs
        $group: { 
          _id: null, 
          total: { $sum: '$wins' } 
        }
      }, function(err, result) {
        if (err) reject(err);
        console.log("aggregate result", result);
        let totalVotes = result.length ? result[0] : 0;
        resolve(totalVotes);
      });
    });
  };

  let getLeading = function(cond) { // race, bloodline
    return new Promise(function(resolve, reject) {
      Character
      .find()
      .sort('-wins')
      .limit(100)
      .select(cond)
      .exec(function(err, characters) {
        if (err) reject(err);
        // [ { amarr: 10 }, { caldari: 20 } ]
        let charCount = _.countBy(characters, function(char) {
          return char[cond];
        });
        let maxChar = _.max(charCount, function(val) { return val; });
        let inverted = _.invert(charCount); // { 10: amarr }
        
        let topCond = inverted[maxChar];
        let topCount = charCount[topCond];

        let final = {
          [ cond ]: topCond,
          count: topCount
        }
        resolve(final);
      });
    });
  };

  Promisifier.props({
      totalCount: countChars({}),
      amarrCount: countChars({ race: 'Amarr' }),
      caldariCount: countChars({ race: 'Caldari' }),
      gallenteCount: countChars({ race: 'Gallente' }),
      minmatarCount: countChars({ race: 'Minmatar' }),
      maleCount: countChars({ gender: 'Male' }),
      femaleCount: countChars({ gender: 'Female' }),
      totalVotes: getAggregateVotes(),
      leadingRace: getLeading('race'),
      leadingBloodline: getLeading('bloodline')
  }).then(function(allCounts) {
    console.log("allCounts", allCounts);
    res.send(allCounts);
  }).catch(function(err) {
    return next(err);
  });

  // async approach

  // let conditions = [{}, { race: 'Amarr' }, { race: 'Caldari' }, { race: 'Gallente' }, { race: 'Minmatar' }, { gender: 'Male' }, { gender: 'Female' }];
  // let charCounts = {};

  // let countChars = function(condition, callback) {
  //   let keys = _.values(condition);
  //   let key = _.isEmpty(keys) ? 'TotalCount' : _.first(keys) + 'Count';
  //   Character.count(condition, function(err, charCount) {
  //     charCounts[key] = charCount;
  //     callback(err, charCounts);
  //   });
  // }

  // async.each(conditions, countChars, function(err) {
  //   if (err) return next(err);
  //   console.log("final", charCounts);
  // });

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
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
app.get('/api/characters/top', function(req, res, next) {
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
    
    // another sort so that the oldest chars aren't always on top
    characters.sort(function(a, b) {
      let aPct = a.winningPercentage();
      let bPct = b.winningPercentage();
      if (aPct > bPct) {
        return -1;
      } else if (aPct < bPct) {
        return 1;
      } else return 0;
    });

    res.send(characters);
  });
});

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
app.get('/api/characters/shame', function(req, res, next) {
  Character
  .find()
  .sort('-losses') // losses, descending
  .limit(100)
  .exec(function(err, characters) {
    if (err) return next(err);

    res.send(characters);
  })
});

/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
app.get('/api/characters/:id', function(req, res, next) {
 let id = req.params.id;

 Character.findOne({ characterId: id }, function(err, character) {
   if (err) return next(err);

   if (!character) {
     return res.status(404).send({ message: 'Character not found.' });
   }

   res.send(character);
 });
});

// Server routes with React-router
// This middleware function will be executed on every req to the server.
// On the server a rendered HTML markup is sent to index.html where it is inserted into <div id="app">{{ html|safe }}</div>
app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
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
