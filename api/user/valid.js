/** ****************************************************************************************************
 * @file: valid.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 21-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	jwt      = require( 'jsonwebtoken' ),
	passport = require( 'passport' ),
	RSAKeys  = require( '../../lib/RSAKeys' );

module.exports = async ( req, res ) => {
	const p = res.locals;

	try {
		console.log( p );

		passport.authenticate( 'jwt', { session: false }, function( e, user ) {
			console.log( arguments );
		} )( req, res );
	} catch( e ) {
		p.error( e );
	}
};
