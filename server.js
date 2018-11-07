/** ****************************************************************************************************
 * @file: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';

if( require.main === module ) {
	throw new Error( 'Cannot directly call this file, must start index.js' );
}

const
	gonfig        = require( 'gonfig' ),
	http          = require( 'http' ),
	express       = require( 'express' ),
	helmet        = require( 'helmet' ),
	cors          = require( 'cors' ),
	bodyParser    = require( 'body-parser' ),
	packet        = require( './lib/middleware/packet' ),
	inspection    = require( './lib/middleware/inspection' ),
	captureParams = require( './lib/middleware/captureParams' ),
	{ resolve }   = require( 'path' ),
	debug         = require( './lib/debug' );

let isClosed = false;

/**
 * Server
 */
class Server
{
	constructor()
	{
		this.startTime = new Date();
	}

	/**
	 * hookRoute
	 * @param {object} item - item from the api config
	 * @returns {*} - returns item with required execution function
	 */
	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		// hook route to express
		this.express[ item.method.toLowerCase() ](
			item.route,
			captureParams(),
			( req, res ) => res && res.locals ?
				item.exec( req, res ) :
				res.status( 500 ).send( 'unknown' )
		);

		return item;
	}

	/**
	 * expressInitialize
	 * @description
	 * Initialize express middleware and hook the routes from api.json configuration
	 */
	expressInitialize()
	{
		this.express = express();

		this.express.disable( 'x-powered-by' );

		this.express.use( helmet() );

		this.express.use( bodyParser.raw( { limit: '5gb' } ) );
		this.express.use( bodyParser.json() );
		this.express.use( cors() );
		this.express.use( packet() );
		this.express.use( inspection() );

		gonfig.get( 'api' ).map( item => this.hookRoute( item ) );

		// capture all unhandled errors that might occur
		this.express.use( require( './lib/middleware/captureErrors' )() );
	}

	/**
	 * initialize
	 * @description
	 * Hook `process` variables `uncaughtException`, `unhandledRejection`, and `exit` to handle any potential errors
	 * that may occur. This will allow us to properly handle exit and log all non-V8 level errors without the program
	 * crashing.
	 * @returns {Server} - this
	 */
	initialize()
	{
		this.expressInitialize();

		process
			.on( 'uncaughtException', err => console.log( 'uncaughtException', err ) )
			.on( 'SIGINT', () => {
				console.log( 'SIGINT' );
				this.shutdown( 0 );
			} )
			.on( 'SIGQUIT', () => console.log( 'SIGQUIT' ) )
			.on( 'SIGTERM', () => console.log( 'SIGTERM' ) )
			.on( 'beforeExit', () => console.log( 'beforeExit' ) )
			.on( 'exit', code => {
				console.log( `Exit ${ code }` );
				this.shutdown( code );
			} );

		return this;
	}

	/**
	 * start
	 * @description
	 * create instance of an http server and start listening on the port specified in server.json
	 */
	start()
	{
		this.server = http.createServer( this.express );

		this.server.listen(
			gonfig.get( 'server' ).port,
			() => console.log(
				`${ gonfig.get( 'name' ) } ` +
				`v${ gonfig.get( 'version' ) } ` +
				`running on ${ gonfig.get( 'lanip' ) }:${ gonfig.get( 'server' ).port }\n` +
				`Started on: ${ this.startTime }`
			)
		);

		this.server.on( 'connection', socket => {
			socket.on( 'data', d => console.log( d.toString( 'utf8' ) ) );
		} );
	}

	/**
	 * shutdown
	 * @param {number} code - exit code
	 */
	shutdown( code = 0 )
	{
		if( this.server ) {
			this.server.close();
		}

		if( isClosed ) {
			debug( 'Shutdown after SIGINT, forced shutdown...' );
			process.exit( 0 );
		}

		isClosed = true;

		debug( `server exiting with code: ${ code }` );
		process.exit( code );
	}
}

/**
 * module.exports
 * @description
 * export a singleton instance of Server
 * @type {Server}
 */
module.exports = new Server();
