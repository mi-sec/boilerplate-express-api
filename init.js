/** ****************************************************************************************************
 * @file: init.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' ),
	lanIp  = require( './lib/lanIp' ),
	{
		outputJson,
		pathExists
	}      = require( 'fs-extra' ),
	{
		resolve,
		join
	}      = require( 'path' );

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
		if( !await pathExists( userspath ) ) {
			await outputJson( userspath, [] );
		}

		gonfig
			.load( 'users', userspath )
			.refresh();
	} catch( e ) {
		console.error( e );
	}
};
