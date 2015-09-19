import promiseResponder from './promiseResponder';

export default function( res, next, serviceClass, packet, sendResponse = false ) {
    let service;

    service = new serviceClass( packet );

    if (sendResponse) {
        service.execute()
            .then( promiseResponder( res ) )
            .catch( next );
    } else {
        service.execute();
    }
}
