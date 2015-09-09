import alt from '../alt';
import FooterActions from '../actions/FooterActions';

class FooterStore {
    constructor() {
        console.log("init footerStore");
        // register callbacks with dispatcher
        // bind all the actions inside FooterActions
        // alternative - this.bindListeners({ callback: action })
        this.bindActions(FooterActions);

        // initial state
        // all instance variables will become state
        this.characters = [];
    }

    onGetTopCharactersSuccess(data) {
        this.characters = data.slice(0, 5);
    }

    onGetTopCharactersFail(jqXhr) {
        // Handle multiple response formats, fallback to HTTP status code number.
    toastr.error(jqXhr.responseJSON && jqXhr.responseJSON.message || jqXhr.responseText || jqXhr.statusText);
    }
}

export default alt.createStore(FooterStore);
