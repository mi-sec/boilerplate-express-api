/** ****************************************************************************************************
 * File: formalizeLogMessage.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = arr => {
    return arr.map( i => {
        if( i.length < 60 ) {
            i += ' '.repeat( 60 - i.length );
        }
        return i;
    } ).join( '' );
};