/** ****************************************************************************************************
 * File: generateSalt.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    { randomBytes } = require( 'crypto' );

module.exports = ( bytes = 256 ) => {
    return new Promise(
        ( res, rej ) => {
            randomBytes(
                bytes,
                ( e, buf ) => e ? rej( e ) : res( buf.toString( 'hex' ) )
            );
        }
    );
};