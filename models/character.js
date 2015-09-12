let mongoose = require('mongoose');

// create a schema - enforce fields to be a type
let characterSchema = new mongoose.Schema({
  characterId: { type: String, unique: true, index: true },
  name: String,
  race: String,
  gender: String,
  bloodline: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  reports: { type: Number, default: 0 },
  // an array of two numbers [Math.random(), 0]
  // use index `2d` for geospatial indexing
  // db.docs.findOne( { random : { $near : [Math.random(), 0] } } )
  random: { type: [Number], index: '2d' },
  // boolean for identifying which characters have already been voted
  voted: { type: Boolean, default: false }
});

export default mongoose.model('Character', characterSchema);
