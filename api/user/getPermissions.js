/** ****************************************************************************************************
 * File: getPermissions.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    console.log( 'HERE ' );
    console.log( p.params );
    
    return Promise.resolve()
        .then(
            () => p.respond( new Response( 200, { token: p.token, params: p.params } ) )
        )
        .catch(
            e => p.error( new Response( 500, e ) )
        );
};