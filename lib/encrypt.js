/** ****************************************************************************************************
 * File: encrypt.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    { createHmac } = require( 'crypto' );

module.exports = ( data, secret, encryption = 'sha256' ) => {
    return Promise.resolve(
        createHmac( encryption, secret )
            .update( data )
            .digest( 'hex' )
    );
};