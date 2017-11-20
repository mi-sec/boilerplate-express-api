/** ****************************************************************************************************
 * File: validateJWToken.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    jwtoken     = require( 'jsonwebtoken' ),
    PERMISSIONS = require( '../config/permissions' ),
    APIError    = require( './APIError' ),
    replaceIdentifier = require( './replaceIdentifier' );

module.exports = ( token, secret ) => {
    return new Promise(
        ( res, rej ) => {
            jwtoken.verify( token, secret,
                ( e, d ) => {
                    if( e ) {
                        if( e.name === 'TokenExpiredError' ) {
                            rej( APIError.TOKEN_EXPIRED );
                        } else if( e.name === 'JsonWebTokenError' ) {
                            rej( APIError.TOKEN_ERROR );
                        } else {
                            rej( e );
                        }
                    } else {
                        d.permissions = d.permissions.map(
                            i => {
                                i = replaceIdentifier( i, PERMISSIONS.KEYS.rSUB, d.sub );
                                i = replaceIdentifier( i, PERMISSIONS.KEYS.rAUD, d.aud );
                                return i;
                            }
                        );
                        
                        res( d );
                    }
                }
            );
        }
    );
};