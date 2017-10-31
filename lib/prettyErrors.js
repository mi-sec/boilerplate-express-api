/** ****************************************************************************************************
 * File: prettyErrors.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = ( err, stack = false ) => {
    let s = err.message;
    if( err.reason ) s += ', Reason: ' + err.reason;
    if( err.originalMessage ) s += ( err.reason ? ', ': ' ' ) + 'Original: ' + err.originalMessage;
    if( stack )
        s += '\n    ' + err.stack.split( /[\r\n]+/ ).join( '\n    ' ) + '\n';
    return s;
};