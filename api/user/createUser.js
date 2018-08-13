/** ****************************************************************************************************
 * File: createUser.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	Response     = require( 'http-response-class' ),
	APIError     = require( '../../lib/APIError' ),
	generateSalt = require( '../../lib/generateSalt' ),
	encrypt      = require( '../../lib/encrypt' ),
	permissions  = require( '../../config/permissions' );

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
				.then(
					password => ( {
						permissions: p.data.permissions || permissions.USER,
						username: p.username,
						password,
						salt
					} )
				)
		)
		.then(
			o => {
				if( !Array.isArray( o.permissions ) ) {
					return Promise.reject( APIError.BAD_PERMISSION_SET );
				} else {
					return Promise.resolve( o );
				}
			}
		)
		.then(
			o => process.userDatabase.post( { ...p.data, ...o } )
		)
		.then( d => {
			console.log( d );

			delete d.data[ 0 ].permissions;
			delete d.data[ 0 ].password;
			delete d.data[ 0 ].salt;
			return p.respond( d );
		} )
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
