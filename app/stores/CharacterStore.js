import {assign, contains} from 'underscore';
import alt from '../alt';
import CharacterActions from '../actions/CharacterActions';

class CharacterStore {
    constructor() {
        this.bindActions(CharacterActions);

        this.characterId = '';
        this.isReported = false;
        this.name = 'TBD';
        this.race = 'TBD';
        this.bloodline = 'TBD';
        this.gender = 'TBD';
        this.winLossRatio = 0;
        this.wins = 0;
        this.losses = 0;
    }

    onGetCharacterSuccess(data) {
        assign(this, data); // merge in character properties

        // block user from reporting a character twice
        let reports = this._getLocalReports();
        this.isReported = contains(reports, this.characterId);
        // If is NaN (from division by zero) then set it to "0"
        this.winLossRatio = ((this.wins / (this.wins + this.losses) * 100) || 0).toFixed(1);

        $(document.body).attr('class', 'profile ' + this.race.toLowerCase());
    }

    onGetCharacterFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }

    onReportSuccess() {
        this.isReported = true;
        let reports = this._getLocalReports();
        reports.push(this.characterId);
        this._setLocalReports({ reports: reports});

        toastr.warning('Character has been reported.');
    }

    onReportFail(jqXhr) {
        toastr.error(jqXhr.responseJSON.message);
    }

    _getLocalReports() {
        let localData = localStorage.getItem('NEF') ? JSON.parse(localStorage.getItem('NEF')) : {};
        localData.reports = localData.reports || [];
        return localData.reports;
    }

    _setLocalReports(data) {
        localStorage.setItem('NEF', JSON.stringify(data));
    }
}

export default alt.createStore(CharacterStore);
