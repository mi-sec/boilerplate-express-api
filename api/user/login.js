/** ****************************************************************************************************
 * File: login.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	Response    = require( 'http-response-class' ),
	jwtoken     = require( 'jsonwebtoken' ),
	PERMISSIONS = require( '../../config/permissions' ),
	{ JWT }     = require( '../../config' ),
	APIError    = require( '../../lib/APIError' ),
	encrypt     = require( '../../lib/encrypt' );

module.exports = ( req, p ) => {
	return Promise.resolve()
		.then(
			() => {
				if( p.username && p.password ) {
					return process.userDatabase.get( { username: p.username } );
				} else if( p.hasApiKey ) {
					if( p.apikey === process.config.masterKey ) {
						const
							data = {
								token: jwtoken.sign( {
									aud: JWT.AUD,
									sub: process.config.masterKey,
									permissions: PERMISSIONS.ADMIN,
									exp: ~~( Date.now() / 1000 ) + JWT.EXPIRE
								}, JWT.AUD ),
								username: 'admin'
							};

						return p.respond( new Response( 200, data ) );
					} else {
						// do future api key validation but for now only allow master key
						return Promise.reject( APIError.UNKNOWN_API_KEY );
					}
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
							return Promise.resolve( user );
						} else {
							return Promise.reject( APIError.INCORRECT_USERNAME_PASSWORD );
						}
					}
				)
		)
		.then( user => {
			user.token = jwtoken.sign(
				{
					aud: JWT.AUD,
					sub: user._id,
					permissions: user.permissions,
					ext: {
						hello: 'world'
					},
					exp: ~~( Date.now() / 1000 ) + JWT.EXPIRE
				},
				JWT.AUD
			);

			delete user.permissions;
			delete user.password;
			delete user.salt;

			if( !user.token ) {
				return Promise.reject( APIError.INTERNAL_AUTHORIZATION_ERROR );
			} else {
				return Promise.resolve( user );
			}
		} )
		.then( user => p.respond( new Response( 200, user ) ) )
		.catch(
			e => {
				if( e instanceof Response ) {
					p.error( e );
				} else {
					p.error( new Response( 500, e.stackTrace || e.message ) );
				}
			}
		);
};
