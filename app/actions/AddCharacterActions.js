import alt from '../alt'; // instantiate Flux dispatcher

class AddCharacterActions {
    constructor() {
        this.generateActions(
            'addCharacter', // [name, gender]
            'updateName',
            'updateGender'
        );
    }
    invalidName() {

    }
    invalidGender() {

    }
}

export default alt.createActions(AddCharacterActions);
