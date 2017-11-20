/** ****************************************************************************************************
 * File: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    fs             = require( 'fs' ),
    http           = require( 'http' ),
    https          = require( 'https' ),
    express        = require( 'express' ),
    bodyParser     = require( 'body-parser' ),
    compression    = require( 'compression' ),
    methodOverride = require( 'method-override' ),
    redirect       = require( 'redirect-https' ),
    inspector      = require( './lib/middleware/packetInspector' ),
    captureParams  = require( './lib/middleware/captureParameters' ),
    authorization  = require( './lib/middleware/authorization' ),
    spam           = require( './lib/middleware/spam' ),
    packet         = require( './lib/middleware/packet' ),
    log            = require( './lib/middleware/log' ),
    MongoDB        = require( './lib/MongoDB' ),
    formalizeLog   = require( './lib/formalizeLog' ),
    strObj         = val => typeof val === 'string' ? val : JSON.stringify( val, null, 4 );

let isClosed = false;

class Server
{
    constructor( config )
    {
        log.immediate.error(
            '*****'.repeat( 12 ) +
            `\n* Server Initializing\n` +
            '*****'.repeat( 12 )
        );

        this.debug = {
            returnStackTraces: true,
            trace: false
        };

        process.config = typeof config === 'string' ? require( config ) : config;

        this.setEnvironment();
        this.logInitialize();
        this.expressInitialize();
    }

    setEnvironment()
    {
        const
            nodeEnv = ( process.env.node_env || process.env.NODE_ENV || 'development' ).toLowerCase();

        process.env.NODE_ENV = process.config.node_env = nodeEnv === 'production' ? nodeEnv : 'development';
    }

    expressInitialize()
    {
        this.express = express();
        this.express.disable( 'x-powered-by' );
        this.express.locals.server = this;
        this.express.locals.config = process.config;
        packet.initialize( this );
    }

    logInitialize()
    {
        log.initialize( this );
    }

    mongoInitialize()
    {
        return new Promise(
            ( res, rej ) => {
                // Connecting to users collection
                new MongoDB( 'default', 'users' )
                    .initialize()
                    .then( inst => {
                        process.userDatabase = inst;
                        return inst.insertPilotObject(
                            process.config.JWT.AUD,
                            process.config.JWT.ISS
                        );
                    } )
                    .then( m => {
                        process.config.masterKey = '' + m.authcode;
                        process.config.timestamp = m.timestamp;

                        log.info(
                            '*****'.repeat( 12 ) +
                            `\n* Mongo Users Table Initialize.\n` +
                            '*****'.repeat( 12 )
                        );
                    } )
                    .then( res )
                    .catch( rej );

                // Connect to different collections or databases in the future
            }
        );
    }

    initialize()
    {
        // TODO: if your application is running behind NGINX, be sure to lock down trusted proxies
        // TODO: to local host only for security purposes.
        // this.express.set( 'trust proxy' );

        if( process.config.useTLS ) {
            this.express.use( redirect() );
        }

        this.express.use( compression() );
        this.express.use( bodyParser.urlencoded( { extended: true } ) );
        this.express.use( bodyParser.json() );
        this.express.use( methodOverride() );

        this.express.use( log.middleware() );
        this.express.use( packet.prepare() );
        this.express.use( inspector() );
        this.express.use( captureParams() );
        this.express.use( authorization() );
        this.express.use( spam() );

        process.config.port = process.config.port || 80;

        return new Promise(
            ( res, rej ) => {
                process
                    .on( 'SIGINT', () => {
                        log.info( 'Received SIGINT, graceful shutdown...' );
                        this.shutdown( 0 );
                    } )
                    .on( 'uncaughtException', err => {
                        log.error( 'global status: ' + ( err.status || 'no status' ) + '\n' + strObj( err.message ) + '\n' + strObj( err.stack ) );
                        log.error( err );
                    } )
                    .on( 'exit', code => {
                        log.info( `Received exit with code ${code}, graceful shutdown...` );
                        this.shutdown( 0 );
                    } );

                // TODO: LOAD API KEYS AND SETUP AUTH HERE

                this.mongoInitialize()
                    .then( res )
                    .catch( e => rej( `Cannot connect to MongoDB\n* Recommend running \`npm run mongo\`\n* ${e}` ) );
            }
        )
            .then(
                () => log.notify.message(
                    formalizeLog( [
                        '\n' + '*****'.repeat( 12 ),
                        `\n*   Server initialized.`,
                        `\n*`,
                        `\n*   Application Name: ${process.config.name}`,
                        `\n*   Application Version: v${process.config.version}`,
                        `\n*`,
                        `\n*   Application AUD: ${process.config.JWT.AUD}`,
                        `\n*   Application ISS: ${process.config.JWT.ISS}`,
                        `\n*   Master authCode: ${process.config.masterKey}`,
                        `\n*`,
                        `\n*   Running on: ${process.config.useTLS ? 'https' : 'http'}://${process.config.host}:${process.config.port}/`,
                        `\n*   Started at: ${process.config.timestamp}`,
                        '\n' + '*****'.repeat( 12 )
                    ] )
                )
            )
            .then( () => this )
            .catch(
                e => {
                    log.immediate.fatal(
                        '*****'.repeat( 12 ) +
                        `\n*\n* Error reported: ${e}\n*\n` +
                        '*****'.repeat( 12 )
                    );

                    this.shutdown( 2 );
                }
            );
    }

    hookRoute( item, serviceName )
    {
        item.exec = require( item.exec );

        if( typeof item.exec !== 'function' ) {
            log.fatal( `No handler found for ${item.method} ${item.route} in "${serviceName}"` );
            this.shutdown( 1 );
        }

        if( item.route.includes( ':' ) ) {
            const
                path       = item.route,
                identifier = item.route.match( /(:)\w+/ ).shift();

            // This might eventually need to search more matches... /users/:id/:stuff
            process.config.parameterCapture.push( {
                path,
                identifier,
                pre: path.substr( 0, path.indexOf( identifier ) ),
                post: path.substr( path.indexOf( identifier ) + identifier.length )
            } );
        }

        const
            request = ( req, res ) => {
                if( res.locals ) {
                    return item.exec( req, res.locals );
                }
            };

        this.express[ item.method.toLowerCase() ]( item.route, request );
    }

    start()
    {
        Object.keys( process.config.api )
            .map(
                i => this.hookRoute( process.config.api[ i ], i )
            );

        return new Promise( res => {
            if( process.config.useTLS ) {
                const
                    options = require( 'tls' ).createSecureContext( {
                        key: fs.readFileSync( './.ssl/server.key', 'utf8' ),
                        cert: fs.readFileSync( './.ssl/server.crt', 'utf8' )
                    } );

                this.server = https.createServer( options, this.express );
            } else {
                this.server = http.createServer( this.express );
            }

            this.server.listen( process.config.port, () => {
                // this.ipAddress = U.extractIP( os.networkInterfaces() );
                // this.events = new Events( this, this.ipAddress );

                Promise.resolve()
                    .then( () => {
                        log.immediate.log(
                            '*****'.repeat( 12 ) +
                            `\n* Server Started.\n` +
                            '*****'.repeat( 12 )
                        );

                        res( this );
                    } )
                    .catch( err => {
                        log.error( err );
                        this.shutdown( 1 );
                    } );
            } );
        } );
    }

    shutdown( code )
    {
        code = code || 0;

        if( this.server ) {
            this.server.close();
            process.userDatabase.close();
        }

        if( isClosed ) {
            log.immediate.info( 'Shutdown after SIGINT, forced shutdown...' );
            process.exit( 0 );
        }

        isClosed = true;

        if( code === 0 )
            log.immediate.info( process.config.exitCodes[ code ] );
        else
            log.immediate.fatal( process.config.exitCodes[ code ] );

        process.exit( code );
    }
}

// TODO: implement cross-process talking
// process.on( 'message', function( packet ) {
//     process.send( {
//         type: 'process:msg',
//         data: {
//             success: true
//         }
//     } );
// } );

if( require.main === module ) {
    try {
        new Server( require( './config' ) ).initialize().then( inst => inst.start() );
    } catch( e ) {
        console.trace( e );
    }
} else
    module.exports = ( config = require( './config' ) ) => new Server( config );