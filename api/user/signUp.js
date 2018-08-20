/** ****************************************************************************************************
 * @file: signup.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	Response       = require( 'http-response-class' ),
	argon2         = require( 'argon2' ),
	Authentication = require( '../../lib/auth/initAuthentication' ),
	{
		User,
		validate
	}              = require( '../../lib/structs' );

module.exports = ( req, res ) => {
	const p = res.locals;
	
	return validate( User, p.data )
		.then(
			d => argon2.hash( d.password, { type: argon2.argon2id } )
				.then( pass => ( d.password = pass, d ) )
		)
		.then( d => ( console.log( d ), d ) )
		.then( d => Authentication.signUp( d ) )
		.then( d => p.respond( d ) )
		.catch( e => p.error( e ) );
};
