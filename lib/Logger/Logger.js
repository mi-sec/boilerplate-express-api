/** ****************************************************************************************************
 * File: Logger.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    style         = require( 'ansi-styles' ),
    UTCDate       = require( '../middleware/UTCDate' ),
    getIP         = require( './getIP' ),
    os            = require( 'os' ),
    hostname      = os.hostname(),
    requestLogger = require( './requestLogger' ),
    _tokens       = {},
    _formats      = {};

class Logger
{
    constructor()
    {
        this._level = Logger.LogLevels.indexOf( 'INFO' );
        this._LOG_ERROR = Symbol( 'For attaching the error object' );
        
        this.defaultFormat = 'default';
        
        this.format( 'default', ':on:date[iso] [:level] [:remote-addr] [:status]:off - :request[baseUrl] | :method :url' );
        
        this.token( 'response-time', ( req, res, digits ) => res._startAt && ( res._startAt[ 0 ] * 1e3 + res._startAt[ 1 ] * 1e-6 ).toFixed( typeof digits !== 'number' ? 3 : digits ) );
        this.token( 'url', req => req.originalUrl || req.url );
        this.token( 'method', req => req.method );
        this.token( 'date', () => new UTCDate( new Date() ) );
        this.token( 'note', () => style.cyan.open );
        
        this.token( 'on', ( req, res ) => res.headersSent ? this.colored( res.statusCode ).open : '' );
        this.token( 'off', ( req, res ) => res.headersSent ? style.reset.open : '' );
        
        this.token( 'status', ( req, res ) => res.headersSent && String( res.statusCode ) );
        
        this.token( 'referrer', req => req.headers[ 'referer' ] || req.headers[ 'referrer' ] );
        this.token( 'remote-addr', getIP );
        this.token( 'remote-user', req => req.locals && req.locals.requestData && req.locals.requestData.userData && req.locals.requestData.userData.userName );
        
        this.token( 'http-version', req => req.httpVersionMajor + '.' + req.httpVersionMinor );
        this.token( 'user-agent', req => req.headers[ 'user-agent' ] );
        
        this.token( 'req', ( req, res, field ) => pretty( field === 'content-length' ? contentLength( req ) : req.headers[ field.toLowerCase() ] ) );
        this.token( 'res', ( req, res, field ) => res.headersSent ? pretty( field === 'content-length' ? contentLength( res ) : res.getHeader( field ) ) : '' );
        
        this.token( 'request', ( req, res, field ) => pretty( deep( req, field ) ) );
        this.token( 'response', ( req, res, field ) => pretty( deep( res, field ) ) );
        
        this.token( 'error', ( req, res, field ) => {
            let err = res && res[ this.LOG_ERROR ];
            if( err )
            {
                if( field === 'message' && typeof this.prettyErrors === 'function' )
                    return this.prettyErrors( err );
                else
                    return err[ field ];
            }
            else if( field === 'stack' )
                return new Error( 'no response or no error in res.LOG_ERROR' ).stack;
            return 'no response or no error in res.LOG_ERROR';
        } );
    }
    
    get LOG_ERROR()
    {
        return this._LOG_ERROR;
    }
    
    colored( status )
    {
        return status >= 500 ? style.red
            : status >= 400 ? style.yellow
                : status >= 300 ? style.cyan
                    : status >= 200 ? style.green
                        : style.white;
    }
    
    /**
     * Compile a format string into a function.
     *
     * @param {Array<string?Array<string>>} format
     * @return {function}
     * @public
     */
    compile( format ) {
        if( !Array.isArray( format ) )
            throw new TypeError( 'argument format must be a string' );
        return function( ignore, req, res ) {
            return format.reduce( ( str, piece ) => {
                if( typeof piece === 'string' )
                    return str + piece;
                else if( piece.length === 1 )
                    return str + ( _tokens[ piece[ 0 ] ]( req, res ) || '' );
                else
                    return str + ( _tokens[ piece[ 0 ] ]( req, res, piece[ 1 ] ) || '' );
            }, '' );
        };
    }
    
    token( name, fn )
    {
        _tokens[ name ] = fn;
        return this;
    }
    
    set level( logLevel )
    {
        this._level = typeof logLevel === 'string' ? Logger.LogLevels.indexOf( logLevel ) : logLevel;
    }
    
    get level()
    {
        return Logger.LogLevels[ this._level ];
    }
    
    log( level, msg )
    {
        const
            reqLevel = typeof level === 'string' ? Logger.LogLevels.indexOf( level ) : level;
        
        if( reqLevel < this._level )
            return;
        
        const
            prev      = _tokens.msg,
            prevLevel = _tokens.level;
        
        _tokens.msg = () => typeof msg === 'string' ? msg : ( ( msg instanceof Error && typeof this.prettyErrors === 'function' ) ? this.prettyErrors( msg ) : ( msg.message || msg.name || 'no message found' ) );
        _tokens.level = () => Logger.LogLevels[ reqLevel ];
        
        const
            line = this.getFormatFunction( this.logFormat )( _tokens, { headers: {} }, {} );
        
        if( line !== null )
            ( this.options.stream ).write( line.trim() + '\n' );
        _tokens.msg = prev;
        _tokens.level = prevLevel;
        if( process.env.NODE_ENV === 'development' && ( level === 'FATAL' || level === 'ERROR' ) )
            console.trace();
    }
    
    init( options )
    {
        const
            opts = {
                logLevel: 'TRACE',
                logFormat: 'default',
                stream: process.stdout,
                useFormat: 'default',
                ...options
            };
        
        if( opts.prettyErrors )
            this.prettyErrors = opts.prettyErrors;
        
        this.token( 'auth', () => '' );
        this.token( 'host', () => hostname );
        this.token( 'level', () => typeof this._level === 'string' ? this._level : Logger.LogLevels[ this._level ] );
        this.token( 'env', () => process.env.NODE_ENV );
        this.token( 'msg', ( req, res ) => res[ this.LOG_ERROR ] ? res[ this.LOG_ERROR ].message : '' );
        
        if( typeof opts.tokens === 'object' )
            Object.keys( opts.tokens )
                .forEach(
                    tokenName => this.token( tokenName, opts.tokens[ tokenName ] )
                );
        
        if( typeof opts.formats === 'object' )
            Object.keys( opts.formats )
                .forEach(
                    formatName => this.format( formatName, opts.formats[ formatName ] )
                );
        
        this.logFormat = opts.logFormat || 'combined';
        this.level = opts.logLevel || Logger.TRACE;
    }
    
    format( name, fmt )
    {
        if( typeof fmt !== 'string' ) {
            _formats[ name ] = fmt;
            return this;
        }
        
        _formats[ name ] = fmt.split( /(:[-\w]{2,}(?:\[[^\]]+])?)/ )
            .filter( s => !!s )
            .map( s => {
                if( s[ 0 ] !== ':' )
                    return s;
                
                const m = s.match( /:([-\w]{2,})(?:\[([^\]]+)])?/ );
                return m[ 2 ] ? [ m[ 1 ], m[ 2 ] ] : [ m[ 1 ] ];
            } );
        
        return this;
    }
    
    getFormatFunction( name )
    {
        const
            fmt = _formats[ name ] || name || _formats[ this.defaultFormat ];
        
        return typeof fmt !== 'function' ? this.compile( fmt ) : fmt;
    }
    
    hook( app )
    {
        app.use( requestLogger.call( this, 'default', this.options ) );
    }
}

Logger.LogLevels = [
    'ALL',
    'TRACE',
    'DEBUG',
    'INFO',
    'WARN',
    'ERROR',
    'FATAL',
    'OFF'
];

Logger.LogLevels.forEach(
    lvl => {
        Object.defineProperty( Logger, lvl, {
            get() {
                return lvl;
            }
        } );
        
        Logger.prototype[ lvl.toLowerCase() ] = msg => module.exports.log( lvl, msg );
    }
);

module.exports = new Logger();