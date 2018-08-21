/** ****************************************************************************************************
 * @file: init.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig  = require( 'gonfig' ),
	argon2  = require( 'argon2' ),
	UUIDv4  = require( 'uuid/v4' ),
	RSAKeys = require( './lib/RSAKeys' ),
	lanIp   = require( './lib/lanIp' ),
	{
		readJson,
		outputJson,
		pathExists
	}       = require( 'fs-extra' ),
	{
		resolve,
		join
	}       = require( 'path' );

const
	logpath   = resolve( './logs' ),
	datapath  = resolve( './data' ),
	userspath = join( datapath, 'users.json' );

module.exports = async () => {
	// get the local ip
	await gonfig.set( 'lanip', lanIp );

	// set log path
	gonfig.set( 'logpath', logpath );

	// set data path
	gonfig.set( 'datapath', datapath );

	// set users json for local authentication
	gonfig.set( 'userspath', userspath );

	try {
		// check if there's a user config file, make one if there isn't
		const
			localUsersExists = await pathExists( userspath ),
			password         = await argon2.hash( 'password', { type: argon2.argon2id } ),
			username         = 'admin',
			sub              = UUIDv4();

		if( localUsersExists ) {
			const
				localUsers = await readJson( userspath ),
				users      = new Map( localUsers );

			if( !users.has( username ) ) {
				await outputJson( userspath, [ [ username, { sub, username, password } ] ] );
			}
		} else {
			await outputJson( userspath, [ [ username, { sub, username, password } ] ] );
		}

		await RSAKeys.generateRSAKeyPair();
		
		gonfig
			.load( 'users', userspath )
			.load( 'server', 'config/server.json' )
			.load( 'api', 'config/api.js' )
			.refresh();

		require( './lib/auth/initAuthentication' )();
	} catch( e ) {
		throw new Error( e );
	}
};
