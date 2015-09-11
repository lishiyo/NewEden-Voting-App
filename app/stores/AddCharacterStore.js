import alt from '../alt';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacterStore {
    constructor() {
        this.bindActions(AddCharacterActions);

        this.name = '';
        this.gender = '';
        this.nameValidationState = false;
        this.genderValidationState = false;
        this.helpBlock = '';
    }

    onAddCharacter(payload) { // [ name, gender ]
        console.log("add character", payload);
    }

    onUpdateName(payload) {
        this.name = payload;
    }

    onUpdateGender(payload) {
        this.gender = payload;
    }
}

export default alt.createStore(AddCharacterStore);
