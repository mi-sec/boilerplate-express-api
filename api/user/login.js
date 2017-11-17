/** ****************************************************************************************************
 * File: login.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' ),
    jwt      = require( 'jsonwebtoken' ),
    { JWT }  = require( '../../config' ),
    APIError = require( '../../lib/APIError' ),
    encrypt  = require( '../../lib/encrypt' );

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
                    return Promise.resolve( user.data.pop() );
                } else {
                    return Promise.reject( APIError.USER_NOT_FOUND );
                }
            }
        )
        .then(
            user => encrypt( p.password, user.salt )
                .then(
                    hash => {
                        if( hash === user.password ) {
                            return Promise.resolve();
                        } else {
                            return Promise.reject( APIError.INCORRECT_USERNAME_PASSWORD );
                        }
                    }
                )
        )
        .then( user => {
            const
                payload = {
                    admin: user.admin,
                    permissions: user.permissions
                },
                token   = jwt.sign(
                    payload,
                    JWT.AUD,
                    JWT.EXPIRE
                );
            
            user.token = token;
        } )
        .then( user => p.respond( new Response( 200, user ) ) )
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