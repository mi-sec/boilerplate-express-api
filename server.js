/** ****************************************************************************************************
 * File: server.js
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
	cors          = require( 'cors' ),
	bodyParser    = require( 'body-parser' ),
	packet        = require( './lib/middleware/packet' ),
	inspection    = require( './lib/middleware/inspection' ),
	captureParams = require( './lib/middleware/captureParams' ),
	{ resolve }   = require( 'path' ),
	debug         = require( './debug' );

let isClosed = false;

class Server
{
	constructor()
	{

	}

	hookRoute( item )
	{
		item.exec = require( resolve( item.exec ) );

		this.express[ item.method.toLowerCase() ](
			item.route,
			captureParams(),
			( req, res ) => res && res.locals ?
				item.exec( req, res.locals ) :
				res.status( 500 ).send( 'unknown' )
		);

		return item;
	}

	expressInitialize()
	{
		this.express = express();

		this.express.disable( 'x-powered-by' );

		this.express.use( bodyParser.raw( { limit: '5gb' } ) );
		this.express.use( bodyParser.json() );
		this.express.use( cors() );

		this.express.use( packet() );
		this.express.use( inspection() );

		gonfig.get( 'api' ).map( item => this.hookRoute( item ) );

		this.express.use( require( './lib/middleware/captureErrors' )() );
	}

	initialize()
	{
		this.expressInitialize();

		process
			.on( 'uncaughtException', err => debug( err ) )
			.on( 'unhandledRejection', err => debug( err ) )
			.on( 'SIGINT', () => {
				debug( 'Received SIGINT, graceful shutdown...' );
				this.shutdown( 0 );
			} )
			.on( 'exit', code => {
				debug( `Received exit with code ${ code }, graceful shutdown...` );
				this.shutdown( code );
			} );

		return this;
	}

	start()
	{
		this.server = http.createServer( this.express );

		this.server.listen(
			gonfig.get( 'server' ).port,
			() => debug(
				`${ gonfig.get( 'name' ) } ` +
				`v${ gonfig.get( 'version' ) } ` +
				`running on ${ gonfig.get( 'lanip' ) }:${ gonfig.get( 'server' ).port }`
			)
		);
	}

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

module.exports = new Server();

// basicauth     = require( 'express-basic-auth' ),
// if( process.config.authentication === 'basicauth' ) {
// 	const { challenge, realm } = process.config;
//
// 	this.express.use( basicauth( {
// 		authorizeAsync: true,
// 		authorizer: this.authorizer,
// 		challenge,
// 		realm
// 	} ) );
// }
