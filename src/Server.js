/** ****************************************************************************************************
 * File: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	config      = require( 'config' ),
	express     = require( 'express' ),
	helmet      = require( 'helmet' ),
	bodyParser  = require( 'body-parser' ),
	logger      = require( 'pino' )( {
		level: process.env.NODE_ENV === 'production' ? 'info' : 'all'
	} ),
	expressPino = require( 'express-pino-logger' ),
	Response    = require( 'http-response-class' );

const
	packet                   = require( './middleware/packet' ),
	captureErrors            = require( './middleware/captureErrors' ),
	RawHTTPLogs              = require( './services/RawHTTPLogs' ),
	recursivelyReadDirectory = require( './utils/recursivelyReadDirectory' );

/**
 * Server
 */
class Server
{
	constructor()
	{
		this.isClosed = false;
	}
	
	bindProcess()
	{
		logger.trace( 'bindProcess' );
		
		// catch all the ways node might exit
		process
			.on( 'SIGINT', ( msg, code ) => {
				logger.info( msg );
				process.exit( code );
			} )
			.on( 'SIGQUIT', () => logger.info( 'SIGQUIT' ) )
			.on( 'SIGTERM', ( msg, code ) => {
				logger.info( 'SIGTERM' );
				process.exit( code );
			} );
		
		process
			.on( 'unhandledRejection', err => logger.error( err, 'uncaughtException' ) )
			.on( 'uncaughtException', err => logger.error( err, 'uncaughtException' ) );
		
		process
			.once( 'beforeExit', () => logger.info( 'beforeExit' ) )
			.on( 'exit', () => logger.info( 'exit' ) );
	}
	
	/**
	 * expressInitialize
	 * @description
	 * Initialize express middleware and hook the routes from api.json configuration
	 */
	expressInitialize()
	{
		logger.trace( 'expressInitialize' );
		
		this.app = express();
		
		this.app.disable( 'x-powered-by' );
		this.app.set( 'trust proxy', 1 );
		
		this.app.use( helmet() );
		this.app.use( bodyParser.raw( { limit: '5gb' } ) );
		this.app.use( bodyParser.urlencoded( { extended: false } ) );
		this.app.use( bodyParser.json() );
		this.app.use( expressPino( { logger } ) );
	}
	
	/**
	 * hookRoute
	 * @param {object} item - item from the api config
	 * @returns {*} - returns item with required execution function
	 */
	hookRoute( item )
	{
		const exec = [
			packet(),
			( req, res, next ) => {
				this.reqMeter.mark();
				next();
			}
		];
		
		if( Array.isArray( item.exec ) ) {
			exec.push( ...item.exec );
		} else {
			exec.push(
				( req, res, next ) => {
					if( res && res.locals ) {
						try {
							item.exec( req, res, next );
						} catch( e ) {
							e instanceof Response ?
								res.locals.respond( e ) :
								res.locals.respond(
									new Response( e.statusCode || 500, e.data || e.stack || e.message || e )
								);
						}
					} else {
						res.status( 500 ).send( 'unknown' );
					}
				}
			);
		}
		
		// hook route to express
		this.app[ item.method.toLowerCase() ]( item.route, exec );
		
		return item;
	}
	
	routerInitialize()
	{
		// capture all unknown routes
		// this.hookRoute( require( './middleware/methodNotAllowed' ) );
		
		this.routes.map( item => this.hookRoute( item ) );
		
		// capture all unhandled errors that might occur
		this.app.use( captureErrors() );
	}
	
	async loadRoutes()
	{
		this.routes = await recursivelyReadDirectory( config.get( 'server.routes' ) );
		this.routes = this.routes.map( route => require( route ) );
	}
	
	/**
	 * initialize
	 * @description
	 * Hook `process` variables `uncaughtException`, `unhandledRejection`, and `exit` to handle any potential errors
	 * that may occur. This will allow us to properly handle exit and log all non-V8 level errors without the program
	 * crashing.
	 */
	async initialize()
	{
		// override process handlers to handle failures
		this.bindProcess();
		
		// setup express
		this.expressInitialize();
		await this.loadRoutes();
		
		this.routerInitialize();
	}
	
	/**
	 * start
	 * @description
	 * create instance of an http server and start listening on the port specified in server.json
	 * @param {function} cb - call back from PM2
	 */
	onStart( cb )
	{
		this.server = this.app.listen(
			config.get( 'server.port' ),
			config.get( 'server.host' ),
			() => {
				process.stdout.write(
					`${ config.get( 'name' ) } ${ config.get( 'version' ) } ` +
					`running on ${ config.get( 'server.host' ) }:${ config.get( 'server.port' ) }\n`
				);
				
				logger.info( 'started' );
				
				cb();
			}
		);
		
		this.packets = new RawHTTPLogs( config.get( 'server.logger.maxPacketCapture' ) );
		this.packets.bind( this.server );
	}
	
	sensors( io )
	{
		this.reqMeter = io.meter( 'req/min' );
	}
	
	actuators( io )
	{
		io.action( 'process', reply => reply( { env: process.env } ) );
		io.action( 'server', reply => reply( { server: this.server } ) );
		io.action( 'config', reply => reply( { config: config } ) );
		io.action( 'packets', reply => reply( { packets: this.packets } ) );
	}
	
	/**
	 * onStop
	 * @param {*} err - error
	 * @param {function} cb - pm2 callback
	 * @param {number} code - exit code
	 * @param {string} signal - kill signal
	 */
	onStop( err, cb, code, signal )
	{
		if( this.server ) {
			this.server.close();
		}
		
		if( err ) {
			logger.error( err );
		}
		
		if( this.isClosed ) {
			logger.debug( 'Shutdown after SIGINT, forced shutdown...' );
			process.exit( 0 );
		}
		
		this.isClosed = true;
		
		logger.debug( `server exiting with code: ${ code }` );
		process.exit( code );
	}
}

/**
 * module.exports
 * @description
 * export a singleton instance of Server
 * @type {Server}
 */
module.exports = Server;
