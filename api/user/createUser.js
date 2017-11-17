/** ****************************************************************************************************
 * File: createUser.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response     = require( 'http-response-class' ),
    APIError     = require( '../../lib/APIError' ),
    generateSalt = require( '../../lib/generateSalt' ),
    encrypt      = require( '../../lib/encrypt' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => {
                if( p.username && p.password ) {
                    return process.userDatabase.get( { username: p.username } );
                } else {
                    return Promise.reject( APIError.MISSING_USERNAME_PASSWORD );
                }
            }
        )
        .then(
            user => {
                if( user.data.length ) {
                    return Promise.reject( APIError.USER_EXISTS );
                } else {
                    return Promise.resolve();
                }
            }
        )
        .then( () => generateSalt() )
        .then(
            salt => encrypt( p.password, salt )
                .then( password => ( { password, salt } ) )
        )
        .then(
            obj => process.userDatabase.post( {
                username: p.username,
                password: obj.password,
                salt: obj.salt,
                ...p.data
            } )
        )
        .then( d => {
            delete d.data[ 0 ].password;
            delete d.data[ 0 ].salt;
            return p.respond( d );
        } )
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