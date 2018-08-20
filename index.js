/** ****************************************************************************************************
 * @file: index.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-OCT-2017
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' );

// setup environment config
gonfig
	.setLogLevel( gonfig.LEVEL.BASIC )
	.setEnvironment( process.env.NODE_ENV || gonfig.ENV.DEVELOPMENT );

// set log format
gonfig.set( 'logformat', 'standard' );

( async () => {
	// do any initialization steps here
	await require( './init' )();
	
	// start the server
	await require( './server' )
		.initialize()
		.start();
} )();
