import alt from '../alt'; // instantiate Flux dispatcher

class AddCharacterActions {
    constructor() {
        this.generateActions(
            'addCharacterSuccess',
            'addCharacterFail',
            'updateName',
            'updateGender',
            'invalidName',
            'invalidGender'
        );
    }

    addCharacter(name, gender) {
        $.ajax({
            type: 'POST',
            url: '/api/characters',
            data: { name: name, gender: name }
        })
        .done((data) => {
            this.actions.addCharacterSuccess(data.message);
        })
        .fail((jqXhr) => {
            this.actions.addCharacterFail(jqXhr.responseJSON.message);
        });
    }
}

export default alt.createActions(AddCharacterActions);
