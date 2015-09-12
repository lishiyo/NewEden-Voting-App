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
        // hit express server POST /api/characters
        $.ajax({
            type: 'POST',
            url: '/api/characters',
            data: { name: name, gender: gender }
        })
        .done((data) => {
            console.log("addCharacter success", data);
            this.actions.addCharacterSuccess(data.message);
        })
        .fail((jqXhr) => {
            console.log("addCharacter fail", jqXhr);
            this.actions.addCharacterFail(jqXhr.responseJSON.message);
        });
    }
}

export default alt.createActions(AddCharacterActions);
