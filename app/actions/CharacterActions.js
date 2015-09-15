import alt from '../alt';

class CharacterActions {
  constructor() {
    this.generateActions(
      'reportSuccess',
      'reportFail',
      'getCharacterSuccess',
      'getCharacterFail'
    );
  }

  report(characterId) {
    $.ajax({
        type: 'POST',
        url: '/api/post',
        data: { characterId: characterId }
    })
    .done((data) => {
        this.actions.reportSuccess();
    })
    .fail((jqXhr) => {
        this.actions.reportFail(jqXhr);
    });
  }

  getCharacter(characterId) {
    let url = '/api/characters/' + characterId;
    $.ajax({ url: url })
     .done((data) => {
        this.actions.getCharacterSuccess(data);
     })
     .fail((jqXhr) => {
        this.actions.getCharacterFail(data);
     });
  }
}

export default alt.createActions(CharacterActions);
