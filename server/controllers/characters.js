import Character from '../models/character';
/**
 * GET /api/characters
 * Returns 2 random characters of the same gender that have not been voted yet.
 */

 function getCharacters(req, res, next) {
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

module.exports = {
    getCharacters: getCharacters
};
