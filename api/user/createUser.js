/** ****************************************************************************************************
 * File: createUser.js
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
                if( p.username && p.password ) {
                    return process.userDatabase.get( { username: p.username } );
                } else {
                    return Promise.reject( new Response( 412, 'Missing username or password' ) );
                }
            }
        )
        .then(
            user => {
                if( !user.data.length ) {
                
                } else {
                    return Promise.reject( new Response( 412, 'Missing username or password' ) );
                }
            }
        )
        .then( () => p.respond( new Response( 200, 'pong' ) ) )
        .catch(
            e => {
                if( e instanceof Response ) {
                    p.error( e );
                } else {
                    p.error( new Response( 500, e ) );
                }
            }
        );
};