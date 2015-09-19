import Character from '../models/character';
import config from '../../config';

import _ from 'underscore';
import xml2js from 'xml2js';
import Promise from "bluebird";
import async from 'async';
import request from 'request';

/**
 * GET /api/stats
 * Returns overall statistics.
 */
function getStats(req, res, next) {
  // promises == bluebird
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

  Promise.props({
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
}

/**
 * GET /api/characters/count
 * Returns the total number of characters.
 */
function getCharactersCount(req, res, next) {
  Character.count({}, function(err, count) {
    if (err) return next(err);

    res.send( { count: count });
  })
}

/**
 * GET /api/characters/top
 * Return 100 highest ranked characters. Filter by gender, race and bloodline.
 */
function getCharactersTop (req, res, next) {
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
}

/**
 * GET /api/characters/shame
 * Returns 100 lowest ranked characters.
 */
function getCharactersBottom (req, res, next) {
  Character
  .find()
  .sort('-losses') // losses, descending
  .limit(100)
  .exec(function(err, characters) {
    if (err) return next(err);

    res.send(characters);
  })
}

module.exports = {
    getStats,
    getCharactersCount,
    getCharactersTop,
    getCharactersBottom
};
