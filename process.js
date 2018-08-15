/** ****************************************************************************************************
 * File: process.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	cluster = require( 'cluster' ),
	cpus    = require( 'os' ).cpus().length;

if( cluster.isMaster ) {
	console.log( `Master ${ process.pid } is running` );
	
	for( let i = 0; i < cpus; i++ ) {
		cluster.fork();
	}
	
	cluster.on( 'exit', ( worker, code, signal ) => {
		console.log( signal );
		console.log( `worker ${ worker.process.pid } exited with code ${ code }` );
	} );
} else {
	console.log( `Worker ${ process.pid } started` );
	
	require( './index' );
}
