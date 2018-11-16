/** ****************************************************************************************************
 * File: entrypoint.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2018
 *******************************************************************************************************/
'use strict';

const io  = require( '@pm2/io' );
const app = require( 'express' )();

class MyApp extends io.Entrypoint
{
	// This is the very first method called on startup
	onStart( cb ) {
		this.registerSensors();
		this.actuators();
		
		const http = require( 'http' ).Server( app );
		
		console.log( 'onstart' );
		app.get( '/', ( req, res ) => {
			this.reqMeter.mark();
			res.send( 'Hello From Entrypoint.js' );
		} );
		
		this.server = app.listen( 3000, cb );
	}
	
	// This is the very last method called on exit || uncaught exception
	onStop( err, cb, code, signal ) {
		console.log( 'onstop' );
		console.log( `App has exited with code ${ code }` );
	}
	
	// Here we declare some process metrics
	registerSensors() {
		console.log( 'sensors' );
		this.reqMeter = this.io.meter( 'req/min' );
	}
	
	// Here are some actions to interact with the app in live
	actuators() {
		this.io.action( 'getEnv', ( reply ) => {
			reply( { server: this.server } );
		} );
	}
}

console.log( process );

const _app = new MyApp();

// _app.onStart( console.log );
// _app.onStop( console.log );
// _app.sensors();
// _app.actuators();

module.exports = _app;
