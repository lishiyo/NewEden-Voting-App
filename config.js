module.exports = {
  database: process.env.MONGO_URI || 'localhost',
  URL_BASE_CHARACTERS: 'https://api.eveonline.com/eve/CharacterID.xml.aspx?names=',
  URL_BASE_CHARACTER_INFO: 'https://api.eveonline.com/eve/CharacterInfo.xml.aspx?characterID=',
};
