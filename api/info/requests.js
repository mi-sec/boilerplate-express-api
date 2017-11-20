/** ****************************************************************************************************
 * File: requests.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    // TODO: NOT IMPLEMENTED YET
    return Promise.resolve()
        .then(
            () => p.respond( new Response( 200, 'ok' ) )
        )
        .catch(
            e => p.error( new Response( 500, e.stackTrace || e.message ) )
        );
};