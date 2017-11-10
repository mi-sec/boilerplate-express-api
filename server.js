/** ****************************************************************************************************
 * File: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    http           = require( 'http' ),
    https          = require( 'https' ),
    express        = require( 'express' ),
    bodyParser     = require( 'body-parser' ),
    compression    = require( 'compression' ),
    methodOverride = require( 'method-override' ),
    spam           = require( './lib/middleware/spam' ),
    packet         = require( './lib/middleware/packet' ),
    log            = require( './lib/middleware/log' ),
    strObj         = val => typeof val === 'string' ? val : JSON.stringify( val, null, 4 );

let isClosed = false;

class Server
{
    constructor( config )
    {
        this.debug = {
            returnStackTraces: true,
            trace: false
        };
        
        this.config = typeof config === 'string' ? require( config ) : config;
        
        this.setEnvironment();
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
    
    initialize()
    {
        if( this.config.useTLS === true )
            this.express.all( '*', ( req, res, next ) => {
                if( req.secure )
                    return next();
                if( process.env.NODE_ENV === 'production' || this.config.forceRedirect )
                    res.redirect( `https://${req.hostname}:${this.config.port}${req.url}` );
                else
                    next();
            } );
        
        // TODO: if your application is running behind NGINX, be sure to lock down trusted proxies
        // TODO: to local host only for security purposes.
        // this.express.set( 'trust proxy' );
        
        this.express.use( bodyParser.json() );
        this.express.use( bodyParser.urlencoded( { extended: true } ) );
        this.express.use( compression() );
        this.express.use( methodOverride() );
        
        this.express.use( log.middleware() );
        this.express.use( packet.prepare() );
        this.express.use( spam() );
        
        this.config.port = this.config.port || 80;
        
        return new Promise(
            ( res, rej ) => {
                process
                    .on( 'SIGINT', () => {
                        log.info( 'Received SIGINT, graceful shutdown...' );
                        this.shutdown();
                    } )
                    .on( 'uncaughtException', err => {
                        log.error( 'global status: ' + ( err.status || 'no status' ) + '\n' + strObj( err.message ) + '\n' + strObj( err.stack ) );
                        log.error( err );
                    } )
                    .on( 'exit', code => {
                        log.info( `Received exit with code ${code}, graceful shutdown...` );
                        this.shutdown();
                    } );
                
                // TODO: LOAD API KEYS AND SETUP AUTH HERE
                res();
            }
        )
            .then( () => log.info( 'Server initialized.' ) )
            .then( () => this );
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
                let p = res.locals;
                p.config = item.route;
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
            this.server = http.createServer( this.express );
            
            this.server.listen( this.config.port, () => {
                // this.ipAddress = U.extractIP( os.networkInterfaces() );
                // this.events = new Events( this, this.ipAddress );
                
                Promise.resolve()
                    .then( () => {
                        console.log(
                            '\n' + '*****'.repeat( 12 ) +
                            `\n*\n*\n* Server started. Listening on port ${this.config.port}\n*\n*\n` +
                            '*****'.repeat( 12 ) + '\n'
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
        if( this.server )
            this.server.close();
    
        if( isClosed ) {
            log.immediate.info( 'Double shutdown after SIGINT, forced shutdown...' );
            process.exit( 0 );
        }
    
        isClosed = true;
    
        log.immediate.info( 'exiting, no errors' );
        process.exit( code );
    }
}

if( require.main === module ) {
    try {
        new Server( require( './config' ) ).initialize().then( inst => inst.start() );
    } catch( e ) {
        console.trace( e );
    }
} else
    module.exports = ( config = require( './config' ) ) => new Server( config );