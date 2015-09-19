import Character from '../models/character';
import config from '../../config';

import _ from 'underscore';
import xml2js from 'xml2js';
import async from 'async';
import request from 'request';

/**
 * POST /api/report
 * Reports a character (CharacterActions). Character is removed after 4 reports.
 */
function reportCharacter (req, res, next) {
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
}

/**
 * GET /api/characters/search
 * Looks up a character by name. (case-insensitive)
 */
function searchCharacter (req, res, next) {
  let name = new RegExp(req.query.name, 'i');

  Character.findOne({ name: name }, function(err, character) {
    if (err) return next(err);
    if (!character) {
      return res.status(404).send( { message: "Couldn't find character."});
    }

    res.send({ character: character });
  });
}

/**
 * GET /api/characters/:id
 * Returns detailed character information.
 */
function getCharacterDetail (req, res, next) {
 let id = req.params.id;

 Character.findOne({ characterId: id }, function(err, character) {
   if (err) return next(err);

   if (!character) {
     return res.status(404).send({ message: 'Character not found.' });
   }

   res.send(character);
 });
}

module.exports = {
    reportCharacter,
    searchCharacter,
    getCharacterDetail
};
