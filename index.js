/** ****************************************************************************************************
 * File: index.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-OCT-2017
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' );

gonfig
	.setLogLevel( gonfig.LEVEL.BASIC )
	.setEnvironment( gonfig.ENV.DEBUG )
	.load( 'server', 'config/server.json' )
	.load( 'api', 'config/api.json' )
	.refresh();

gonfig.set( 'authentication', 'LocalAuthentication' );

const
	initEnv = require( './init' ),
	server  = require( './server' );

( async () => {
	await initEnv();
	
	server
		.initialize()
		.start();
} )();
