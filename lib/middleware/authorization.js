/** ****************************************************************************************************
 * File: authorization.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response    = require( 'http-response-class' ),
    APIError    = require( '../APIError' ),
    PERMISSIONS = require( '../../config/permissions' ),
    { JWT }     = require( '../../config' ),
    validate    = require( '../validateJWToken' ),
    replaceIdentifier = require( '../replaceIdentifier' );

function authorization( req, res, next ) {
    const p = res.locals;

    if( !p.config ) {
        return p.error( new Response( 405, `Method: ${req.method} on ${req.path} not allowed` ) );
    } else if( !p.config.route ) {
        return p.error( APIError.INTERNAL_AUTHORIZATION_ERROR );
    }

    if( p.hasApiKey ) {
        if( p.apikey === process.config.masterKey ) {
            p.token = { permissions: PERMISSIONS.ADMIN };
            return next();
        }
    }

    let
        jwtoken = Promise.resolve(),
        now     = null;

    if( p.hasAuthorization ) {
        jwtoken = validate( p.authorization, JWT.AUD );
        now     = ~~( Date.now() / 1000 );
    }

    jwtoken
        .then(
            token => {
                if( p.hasAuthorization ) {
                    if( p.config.permissions ) {
                        p.config.permissions = replaceIdentifier( p.config.permissions, PERMISSIONS.KEYS.rSUB, token.sub );
                        p.config.permissions = replaceIdentifier( p.config.permissions, PERMISSIONS.KEYS.rAUD, token.aud );
                    }

                    if( token.exp <= now ) {
                        return p.error( APIError.TOKEN_EXPIRED );
                    } else if( token.exp - JWT.EXPIRE !== token.iat ) {
                        return p.error( APIError.INTERNAL_AUTHORIZATION_ERROR, 'User mutated token' );
                    } else if( !Array.isArray( token.permissions ) ) {
                        return p.error( APIError.INTERNAL_AUTHORIZATION_ERROR, 'JWT Token Error' );
                    } else if( p.config.permissions && !token.permissions.includes( p.config.permissions ) ) {
                        return p.error( APIError.NOT_AUTHORIZED );
                    } else if( p.config.permission || !token.permissions ) {
                        return p.error( APIError.NOT_AUTHENTICATED );
                    }
                }

                p.token = token || null;

                if( res.locals ) {
                    next();
                }
            }
        )
        .catch( e => {
            if( e instanceof Response ) {
                return p.error( e );
            } else {
                return p.error( new Response( 500, e.stackTrace || e.message ) );
            }
        } );
}

module.exports = () => {
    return authorization;
};