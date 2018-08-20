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
	LocalAuthentication = require( './LocalAuthentication' );

/**
 * authentication
 * @description
 * authentication wrapper to return the authentication class associated with the environment
 */
module.exports = () => {
	passport.use( new LocalStrategy(
		async ( username, password, done ) => {
			console.log( 'local strategy' );
			
			try {
				console.log( LocalAuthentication.users );
				
				if( LocalAuthentication.users.has( username ) ) {
					const user = { ...LocalAuthentication.users.get( username ) };
					
					if( await argon2.verify( user.password, password ) ) {
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
			jwtFromRequest: ExtractJwt.fromHeader(),
			secretOrKey: 'secret',
			issuer: 'boilerplate-express-api',
			audience: 'localhost.com'
		},
		( username, password, done ) => {
			console.log( 'JWTStrategy' );
			
			console.log( username );
			console.log( password );
			// function( err, user ) {
			// 	if( err )
			// 		return done( err );
			// 	if( !user )
			// 		return done( null, false );
			// 	if( user.password != password )
			// 		return done( null, false );
			// 	return done( null, user );
			// } );
		}
	) );
	
	passport.serializeUser( ( user, done ) => {
		delete user.password;
		// delete user.salt;
		done( null, user );
	} );
	
	passport.deserializeUser( ( user, done ) => {
		done( null, user );
	} );
};

