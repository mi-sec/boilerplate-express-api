/** ****************************************************************************************************
 * File: index.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-OCT-2017
 * @version 0.0.0
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' );

gonfig
	.setLogLevel( gonfig.LEVEL.BASIC )
	.setEnvironment( gonfig.ENV.DEBUG )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.js' )
	.refresh();

gonfig.set( 'authentication', 'LocalAuthentication' );

( async () => {
	await require( './init' )();

	require( './server' )
		.initialize()
		.start();
} )();
