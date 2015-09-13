import alt from '../alt'; // instantiate Flux dispatcher
import {assign} from 'underscore'; // merge with overwrite from right

class NavbarActions {
    constructor() {
        this.generateActions(
            // Sets online users count on Socket.IO event update.
            'updateOnlineUsers',
            // Adds "fadeIn" or "fadeOut" CSS class to the loading indicator.
            'updateAjaxAnimation',
            // Update search query value on keypress.
            'updateSearchQuery',
            // ajax callbacks
            'getCharacterCountSuccess',
            'getCharacterCountFail',
            'findCharacterSuccess',
          ' findCharacterFail'
        );
    }

    // Fetch total number of characters from the server.
    getCharacterCount() {
        $.ajax({
            url: '/api/characters/count'
        })
        .done((data) => {
            this.actions.getCharacterCountSuccess(data);
        })
        .fail((jqXhr) => {
            this.actions.getCharacterCountFail(jqXhr);
        });
    }

    // { searchQuery, searchForm, router }
    findCharacter(payload) {
        $.ajax({
            url: '/api/characters/search',
            data: { name: payload.searchQuery }
        })
        .done((data) => { // { count, count }
            assign(payload, data);
            this.actions.findCharacterSuccess(data.count);
        })
        .fail(() => {
            this.actions.findCharacterFail(payload);
        });
    }
}

export default alt.createActions(NavbarActions);
