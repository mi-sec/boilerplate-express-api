/** ****************************************************************************************************
 * File: createApiKey.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

const
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => process.userDatabase.post( p.data )
        )
        .then( p.respond )
        .catch(
            e => p.error( new Response( 500, e ) )
        );
};