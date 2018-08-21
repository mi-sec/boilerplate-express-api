/** ****************************************************************************************************
 * @file: Authentication.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	argon2              = require( 'argon2' ),
	passport            = require( 'passport' ),
	{
		Strategy: LocalStrategy
	}                   = require( 'passport-local' ),
	{
		Strategy: JWTStrategy,
		ExtractJwt
	}                   = require( 'passport-jwt' ),
	LocalAuthentication = require( './LocalAuthentication' ),
	RSAKeys             = require( '../RSAKeys' );

/**
 * authentication
 * @description
 * authentication wrapper to return the authentication class associated with the environment
 */
module.exports = () => {
	passport.use( new LocalStrategy(
		async ( username, claimPassword, done ) => {
			console.log( 'local strategy' );

			try {
				console.log( LocalAuthentication.users );

				if( LocalAuthentication.users.has( username ) ) {
					const { password, ...user } = { ...LocalAuthentication.users.get( username ) };

					if( await argon2.verify( password, claimPassword ) ) {
						done( null, user );
					} else {
						done( null, false );
					}
				} else {
					done( null, false );
				}
			} catch( e ) {
				done( e );
			}
		}
	) );

	passport.use( new JWTStrategy(
		{
			jwtFromRequest: ExtractJwt.fromHeader( 'authorization' ),
			secretOrKey: RSAKeys.privateKey,
			// secretOrKeyProvider: ( request, rawJwtToken, done ) => {
			// 	console.log( rawJwtToken );
			// 	console.log( done );
			// },
			// issuer: 'boilerplate-express-api',
			// audience: 'localhost.com',
			algorithms: [ 'RS256' ]
		},
		( jwt_payload, done ) => {
			console.log( 'JWTStrategy' );
			console.log( arguments );
		}
	) );

	passport.serializeUser( ( user, done ) => {
		console.log( 'serializeUser' );
		console.log( user );
		delete user.password;
		// delete user.salt;
		done( null, user );
	} );

	passport.deserializeUser( ( user, done ) => {
		console.log( 'deserializeUser' );
		done( null, user );
	} );
};

