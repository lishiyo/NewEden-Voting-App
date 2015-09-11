import alt from '../alt'; // instantiate Flux dispatcher

class FooterActions {
    constructor() {
        // straight-through dispatch - `this.dispatch(payload)` to a store
        this.generateActions(
            // update store, re-render component with new data
            'getTopCharactersSuccess',
            // display error notification
            'getTopCharactersFail'
        );
    }

    // view actions - call this from components
    getTopCharacters() {
        $.ajax({ url: '/api/characters/top' })
         .done((data) => {
            // when getTopCharactersSuccess(payload) is fired => 
            // dispatcher notifies all registered subscribers (store callbacks)
            this.actions.getTopCharactersSuccess(data);
         })
         .fail((jqXhr) => {
            this.actions.getTopCharactersFail(jqXhr);
         });
    }
}

export default alt.createActions(FooterActions);
