/** ****************************************************************************************************
 * File: middlewareLogger.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    bufferStream   = require( '../middleware/bufferStream' ),
    onFinished     = require( 'on-finished' ),
    onHeaders      = require( 'on-headers' ),
    CONTENT_LENGTH = Symbol( 'content_length' ),
    contentLength  = o => {
        if( !o || !o.headers || !o.headers[ 'content-length' ] )
            return o[ CONTENT_LENGTH ] || 0;
        
        return o.headers[ 'content-length' ];
    };

function middleware( options = {} ) {
    const buffer = options.buffer;
    
    let stream = options.stream || process.stdout;
    
    if( buffer )
        stream = bufferStream( stream, typeof buffer !== 'number' ? bufferStream.DEFAULT_BUFFER_DURATION : buffer );
    
    return function( req, res, next ) {
        let end   = res.end,
            write = res.write;
        
        res[ CONTENT_LENGTH ] = req[ CONTENT_LENGTH ] = 0;
        
        req.on( 'data',
            chunk => req[ CONTENT_LENGTH ] += chunk.length
        );
        
        res.write = function( ...args ) {
            const payload = args[ 0 ];
            
            if( payload )
                res[ CONTENT_LENGTH ] += Buffer.byteLength( payload.toString(), 'utf8' );
            
            write.call( res, ...args );
        };
        
        res.end = function( ...args ) {
            const payload = args[ 0 ];
            
            if( payload )
                res[ CONTENT_LENGTH ] += Buffer.byteLength( payload.toString(), 'utf8' );
            
            end.call( res, ...args );
        };
        
        req._startAt = process.hrtime();
        
        req._remoteAddress = req.ip || req._remoteAddress || ( req.connection && req.connection.remoteAddress );
        
        res._startAt = undefined;
        
        if( typeof options.requestCallback === 'function' )
            options.requestCallback( 'request', req );
        
        function logRequest() {
            let line,
                method = 'unknown',
                url    = req.route ? req.route.stack.map(
                    layer => ( method = layer.method ) + ':'
                ).join( '' ) + req.route.path : null,
                src    = res.statusCode && String( res.statusCode );
            
            if( !res._startAt )
                res._startAt = process.hrtime( req._startAt );
            
            console.log( 'method', method );
            console.log( url );
            console.log( src );
            
            console.log( {
                verb: method,
                url: req.route ? req.route.path : 'unknown',
                statusCode: src || 'unknown',
                time: res._startAt,
                si: contentLength( req ),
                so: contentLength( res )
            } );
            
            stream.write( line + '\n' );
            
            // if( res._header && res.statusCode && _formats[ src ] )
            //     line = getFormatFunc( src )( _tokens, req, res );
            // else if( url && _formats[ url + ':' + src ] )
            //     line = getFormatFunc( url + ':' + src )( _tokens, req, res );
            // else if( url && _formats[ url ] === null )
            //     line = null;
            // else if( url && _formats[ url ] )
            //     line = getFormatFunc( url )( _tokens, req, res );
            // else
            //     line = formatLine( _tokens, req, res );
            // if( line !== null )
            // {
            //     if( typeof opts.requestCallback === 'function' )
            //         opts.requestCallback( 'logs', line );
            //
            // }
        }
        
        if( immediate )
            logRequest();
        else {
            onHeaders( res, () => res._startAt = process.hrtime( req._startAt ) );
            onFinished( res, logRequest );
        }
        next();
    };
}

module.exports = middleware;