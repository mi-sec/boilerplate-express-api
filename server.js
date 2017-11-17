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
    Guard          = require( 'express-jwt-permissions' ),
    express        = require( 'express' ),
    bodyParser     = require( 'body-parser' ),
    compression    = require( 'compression' ),
    methodOverride = require( 'method-override' ),
    redirect       = require( 'redirect-https' ),
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
        
        this.config = typeof config === 'string' ? require( config ) : config;
        
        this.setEnvironment();
        this.logInitialize();
        this.expressInitialize();
    }
    
    setEnvironment()
    {
        const
            nodeEnv = ( process.env.node_env || process.env.NODE_ENV || 'development' ).toLowerCase();
        
        process.env.NODE_ENV = this.config.node_env = nodeEnv === 'production' ? nodeEnv : 'development';
    }
    
    expressInitialize()
    {
        this.express = express();
        this.express.disable( 'x-powered-by' );
        this.express.locals.server = this;
        this.express.locals.config = this.config;
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
                            this.config.JWT.AUD,
                            this.config.JWT.ISS
                        );
                    } )
                    .then( m => {
                        this.config.mongodb.masterKey = m.authcode;
                        this.config.mongodb.timestamp = m.timestamp;
                        
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
        
        if( this.config.useTLS ) {
            this.express.use( redirect() );
        }
        
        this.express.use( compression() );
        this.express.use( bodyParser.urlencoded( { extended: true } ) );
        this.express.use( bodyParser.json() );
        this.express.use( methodOverride() );
        
        this.express.use( log.middleware() );
        this.express.use( packet.prepare() );
        this.express.use( authorization() );
        this.express.use( spam() );
        
        this.config.port = this.config.port || 80;
        
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
                    .catch( e => rej( `Cannot connect to MongoDB\n* ${e}` ) );
            }
        )
            .then(
                () => log.notify.message(
                    formalizeLog( [
                        '\n' + '*****'.repeat( 12 ),
                        `\n*   Server initialized.`,
                        `\n*`,
                        `\n*   Application Name: ${this.config.name}`,
                        `\n*   Application Version: v${this.config.version}`,
                        `\n*`,
                        `\n*   Application AUD: ${this.config.JWT.AUD}`,
                        `\n*   Application ISS: ${this.config.JWT.ISS}`,
                        `\n*   Master authCode: ${this.config.mongodb.masterKey}`,
                        `\n*`,
                        `\n*   Running on: ${this.config.useTLS ? 'https' : 'http'}://${this.config.host}:${this.config.port}/`,
                        `\n*   Started at: ${this.config.mongodb.timestamp}`,
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
        
        this.express[ item.method.toLowerCase() ](
            item.route,
            ( req, res ) => {
                let p     = res.locals;
                p.config  = item.route;
                p.service = serviceName;
                
                return item.exec( req, p );
            }
        );
    }
    
    start()
    {
        Object.keys( this.config.api )
            .map(
                i => this.hookRoute( this.config.api[ i ], i )
            );
        
        return new Promise( res => {
            if( this.config.useTLS ) {
                const
                    options = require( 'tls' ).createSecureContext( {
                        key: fs.readFileSync( './.ssl/server.key', 'utf8' ),
                        cert: fs.readFileSync( './.ssl/server.crt', 'utf8' )
                    } );
                
                this.server = https.createServer( options, this.express );
            } else {
                this.server = http.createServer( this.express );
            }
            
            this.server.listen( this.config.port, () => {
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
            log.immediate.info( this.config.exitCodes[ code ] );
        else
            log.immediate.fatal( this.config.exitCodes[ code ] );
        
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