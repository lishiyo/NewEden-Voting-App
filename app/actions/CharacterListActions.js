import alt from '../alt';
import { assign, pick, has } from 'underscore';

class CharacterListActions {
  constructor() {
    this.generateActions(
      'getCharactersSuccess',
      'getCharactersFail'
    );
  }

  getCharacters(params) { // { race, bloodline, category }
    let url = '/api/characters/top';
    let paramsData = pick(params, 'race', 'bloodline');

    if (has(params, 'category')) {
        switch(params.category) {
            case 'female':
                assign(paramsData, { gender: 'female' });
                break;
            case 'male':
                assign(paramsData, { gender: 'male' });
                break;
            case 'shame':
                url = '/api/characters/shame';
                break;
        }
    }

    console.log("paramsData, url: ", paramsData, url);
    $.ajax({ 
        url: url , 
        data: paramsData 
    }).done((data) => {
        this.actions.getCharactersSuccess(data);
    }).fail((jqXhr) => {
        this.actions.getCharactersFail(data);
    });
  }
}

export default alt.createActions(CharacterListActions);
