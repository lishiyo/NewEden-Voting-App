import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getTwoCharactersSuccess',
      'getTwoCharactersFail',
      'voteFail'
    );
  }

  getTwoCharacters() {
    $.ajax({ url: '/api/characters' })
      .done(data => {
        console.log("got characters", data);
        this.actions.getTwoCharactersSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getTwoCharactersFail(jqXhr.responseJSON.message);
      });
  }

  vote(winner, loser) {
    $.ajax({
        type: 'PUT',
        url: '/api/characters' ,
        data: { winner: winner, loser: loser }
      })
      .done(() => {
        this.actions.getTwoCharacters();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);