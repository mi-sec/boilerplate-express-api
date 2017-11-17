/** ****************************************************************************************************
 * File: login.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => {
                if( p.hasOwnProperty( 'username' ) && p.hasOwnProperty( 'password' ) ) {
                    return process.userDatabase.get( { username: p.username } );
                }
            }
        )
        .then(
            user => {
                console.log( user );
            }
        )
        .then( () => p.respond( new Response( 200, 'pong' ) ) )
        .catch(
            e => p.error( new Response( 500, e ) )
        );
};