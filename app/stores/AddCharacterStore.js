import alt from '../alt';
import AddCharacterActions from '../actions/AddCharacterActions';

class AddCharacterStore {

    static get ERROR_CLASS() {
        return 'has-success';
    }

    static get SUCCESS_CLASS() {
        return 'has-error';
    }

    constructor() {
        this.bindActions(AddCharacterActions);

        this.name = '';
        this.gender = '';
        this.helpBlock = '';
        this.nameValidationState = '';
        this.genderValidationState = '';
        this.helpBlock = '';
    }

    onAddCharacterSuccess(successMessage) { // [ name, gender ]
        this.nameValidationState = AddCharacterStore.SUCCESS_CLASS;
        this.helpBlock = successMessage;
    }

    onAddCharacterFail(errorMessage) { // if name not in database
        this.nameValidationState = AddCharacterStore.ERROR_CLASS;
        this.helpBlock = errorMessage;
    }

    onUpdateName(event) { // onChange => event to updateName
        this.name = event.target.value;
        this.nameValidationState = '';
        this.helpBlock = '';
    }

    onUpdateGender(event) {
        this.gender = event.target.value;
        this.genderValidationState = '';
    }

    onInvalidName() { // if name is empty
        this.nameValidationState = AddCharacterStore.ERROR_CLASS;
        this.helpBlock = 'Please enter a character name.';
    }

    onInvalidGender() {
        this.genderValidationState = AddCharacterStore.ERROR_CLASS;
    }
}

export default alt.createStore(AddCharacterStore);
