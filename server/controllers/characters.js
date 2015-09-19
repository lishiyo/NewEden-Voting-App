import Character from '../models/character';
import config from '../../config';

import _ from 'underscore';
import xml2js from 'xml2js';
import async from 'async';
import request from 'request'; // HTTP requests to the EVE Online API

// SERVICES
import serviceResponder from '../utils/serviceResponder';
import Test from '../services/test';

/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */
function getCharacters(req, res, next) {
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
}

/**
 * POST /api/characters
 * Adds new character to the database.
 */
function createCharacter(req, res, next) {
    let gender = req.body.gender;
    let characterName = req.body.name;
    let characterIdLookupUrl = config.URL_BASE_CHARACTERS + characterName;

    let parser = new xml2js.Parser();
    // Runs array of function in series, each passing their results to the next in the array
    // However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error.
    async.waterfall([
        // 1 - lookup character in Eve API, get XML API, check if already in mongo database
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
}

/**
 * PUT /api/characters
 * Update winning and losing count for both characters.
 */
function updateCharacterPair (req, res, next) {
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
        return res.status(404).send( { message: 'Character no longer exists.'});
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
}


module.exports = {
    getCharacters,
    createCharacter,
    updateCharacterPair
};
