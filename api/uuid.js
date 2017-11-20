/** ****************************************************************************************************
 * File: uuid.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    return Promise.resolve( p.header.RequestID )
        .then(
            r => p.respond( new Response( 200, r ) )
        )
        .catch(
            e => p.error( new Response( 500, e.stackTrace || e.message ) )
        );
};