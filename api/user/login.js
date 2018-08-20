/** ****************************************************************************************************
 * File: login.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 18-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	jwt      = require( 'jsonwebtoken' ),
	passport = require( 'passport' ),
	RSAKeys  = require( '../../lib/RSAKeys' ),
	{
		User,
		validate
	}        = require( '../../lib/structs' );

module.exports = async ( req, res ) => {
	const p = res.locals;
	
	try {
		const user = await validate( User, p.data );
		
		console.log( user );
		
		passport.authenticate( 'local', ( e, user ) => {
			if( e ) {
				p.error( e );
			} else if( user ) {
				user.token = jwt.sign(
					{
						iat: ~~( Date.now() / 1000 ) - 30,
						sub: user.sub
					},
					RSAKeys.privateKey,
					{
						algorithm: 'RS256',
						expiresIn: 3600000
					}
				);
				
				p.respond( new Response( 200, user ) );
			} else {
				p.error( new Response( 401, 'incorrect username or password' ) );
			}
		} )( req, res );
	} catch( e ) {
		p.error( e );
	}

// return validate( User, p.data )
// 	.then( d => ( console.log( d ), d ) )
// 	.then( d => res.redirect( '/success?username=' + req.user.username ) )
// 	.then( d => p.respond( d ) )
// 	.catch( e => p.error( e ) );
};
