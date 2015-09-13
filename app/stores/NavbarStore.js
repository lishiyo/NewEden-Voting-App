import alt from '../alt';
import NavbarActions from '../actions/NavbarActions';

class NavbarStore {
    constructor() {
        this.bindActions(NavbarActions);
        this.totalCharacters = 0;
        this.onlineUsers = 0;
        this.searchQuery = '';
        this.ajaxAnimationClass = '';
    }

    onUpdateSearchQuery(event) {
        this.searchQuery = event.target.value;
    }

    onFindCharacterSuccess(payload) {
        console.log("found character", payload.character);
        let url = '/characters/' + payload.character.characterId;
        payload.router.transitionTo(url);
    }

    onFindCharacterFail(payload) {
        payload.searchForm.classList.add('shake');
        setTimeout(() => {
          payload.searchForm.classList.remove('shake');
        }, 1000);
    }

    onUpdateOnlineUsers(data) {
        this.onlineUsers = data.onlineUsers;
    }

    onUpdateAjaxAnimation(className) {
        this.ajaxAnimationClass = className; //fadeIn or fadeOut
    }

    onGetCharacterCountSuccess(count) { 
        this.totalCharacters = count;
    }
    
    onGetCharacterCountFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }
}

export default alt.createStore(NavbarStore);
