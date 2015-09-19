import _ from 'underscore';
import Promise from 'bluebird';
import sanitize from '../utils/sanitize';

export default class {
    constructor( payload ) {
        console.log("constructor got payload!");
    }

    execute() {
        return Promise.method( testPrivate ).call( this )
                .bind(this)
                .then( testFinal );

    }
}

/**
 * ====== PRIVATE methods ======
 */

function testPrivate() {
    console.log("testPrivate called!");
}

function testFinal() {
    console.log("testFinal called!");
}
