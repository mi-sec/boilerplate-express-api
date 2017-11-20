/** ****************************************************************************************************
 * File: replaceIdentifier.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = ( i, identifier, actual ) => {
    let check;

    if( identifier instanceof RegExp ) {
        check = i.match( identifier );
    } else {
        check = i.includes( identifier );
    }

    if( check ) {
        return i.replace( identifier, actual );
    } else {
        return i;
    }
};