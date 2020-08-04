/** ****************************************************************************************************
 * File: entrypoint.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2018
 *******************************************************************************************************/
'use strict';

const
	io     = require( '@pm2/io' ),
	Server = require( './core/Server' );

const
	onStart = require( './hooks/onStart' ),
	onStop  = require( './hooks/onStop' );

class API extends io.Entrypoint
{
	// This is the very first method called on startup
	async onStart( cb )
	{
		await onStart();

		this.server = new Server();
		await this.server.initialize();
		this.server.onStart( () => {
			process.send( 'ready' );
			cb();
		} );
	}

	// This is the very last method called on exit || uncaught exception
	async onStop( err, cb, code, signal )
	{
		await onStop();
		this.server.onStop( err, cb, code, signal );
	}

	// Here we declare some process metrics
	sensors()
	{
		this.server.sensors( this.io );
	}

	// Here are some actions to interact with the app in live
	actuators()
	{
		this.server.actuators( this.io );
	}
}

module.exports = new API();
