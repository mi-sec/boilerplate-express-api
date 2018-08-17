/** ****************************************************************************************************
 * @file: init.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig            = require( 'gonfig' ),
	lanIp             = require( './lib/lanIp' ),
	{ outputJson }    = require( 'fs-extra' ),
	{ resolve, join } = require( 'path' );

const
	logpath  = resolve( './logs' ),
	datapath = resolve( './data' ),
	users    = join( datapath, 'users.json' );

module.exports = async () => {
	// get the local ip
	await gonfig.set( 'lanip', lanIp );
	
	// set log path
	gonfig.set( 'logpath', logpath );
	
	// set data path
	gonfig.set( 'datapath', datapath );
	
	// set users json for local authentication
	gonfig.set( 'users', users );
	
	try {
		await outputJson( users, [] );
	} catch( e ) {
		console.error( e );
	}
};
