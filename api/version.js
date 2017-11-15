/** ****************************************************************************************************
 * File: version.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response    = require( 'http-response-class' ),
    { version } = require( '../config' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => p.respond( new Response( 200, 'v' + version ) )
        )
        .catch(
            e => p.error( new Response( 500, e ) )
        );
};