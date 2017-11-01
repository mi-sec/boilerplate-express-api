/** ****************************************************************************************************
 * File: prepare.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

// 2017-10-31T15:11:42.525Z [TRACE] [] [200] [::1] - 593 bytes | 7.796 ms | GET /?ok=true

const
    UUID  = require( 'uuid/v4' ),
    U     = require( '../util' );

let server;

function prepare( req, res, next ) {
    Object.keys( req.headers )
        .forEach(
            hdr => req.headers[ hdr ] = decodeURI( req.headers[ hdr ] )
        );
    
    let
        p = {
            config: null,
            service: null,
            data: typeof req.body === 'string' ? U.parse( req.body ): req.body,
            timeOut: 20000,
            header: {},
            get: name => req.get( name ),
            options: null,
            user: null,
            respond: function( msg = {}, statusCode = 200 ) {
                let
                    contentType,
                    _data;
                
                if( U.isObject( msg ) && !U.isBuffer( msg ) ) {
                    contentType = 'application/json; charset=utf-8';
                    _data = msg.toString();
                } else if( U.isBuffer( msg ) ) {
                    contentType = 'application/octet-stream';
                    _data = msg;
                } else {
                    contentType = 'text/plain';
                    _data = msg;
                }
                
                Object.assign( p.header, {
                    'Content-Type': contentType,
                    'Content-Length': _data.length,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Max-Age': 1728000,
                    RequestID: UUID()
                } );
                
                p.res.set( p.header );
                p.res.status( msg.statusCode || statusCode ).send( _data );
                p.kill();
            },
            error: function( err ) {
                // if( !( err instanceof Response ) )
                //     throw new APIError( APIError.REQUIRE_RESPONSE_CLASS );
                
                // p.res[ log.LOG_ERROR ] = typeof err === 'string' ? new Error( err ): err;
                
                if( err.stack )
                    if( !err.statusCode || err.statusCode === 500 || ( server.debug.returnStackTraces && err.stack ) )
                        err.stackTrace = err.stack;
                
                err.reason = err.reason || 'No reason provided';
                err.serviceName = p.service || 'unknown';
                
                if( err.deprecated )
                    err.deprecated = true;
                
                // if( p.timing ) {
                //     p.timing.stop( 'handler' );
                //     h.timing = p.timing.done();
                //     TODO: send timing stats to db
                // }
                
                const _data = err.toString();
                
                Object.assign( p.header, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': _data.length,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Max-Age': 1728000,
                    RequestID: UUID()
                } );
                
                p.res.set( p.header );
                p.res.status( err.statusCode || 400 ).send( _data );
                
                p.kill();
            }
        };
    
    U.defineProperty( p, 'req', () => req );
    U.defineProperty( p, 'res', () => res );
    U.defineProperty( p, 'params', () => req.params );
    U.defineProperty( p, 'query', () => req.query );
    U.defineProperty( p, 'headers', () => req.headers );
    U.defineProperty( p, 'config', { writable: true, enumerable: false, value: null } );
    U.defineProperty( p, 'service', { writable: true, enumerable: false, value: null } );
    
    // p.options = shared.QueryOptions( p );
    
    p.kill = () => {
        if( p )
            p.res.locals = p.req.locals = p = null;
    };
    
    setTimeout(
        () => {
            // if( p )
            //     p.error( new APIError( 'Server Error - Timeout' ), 500 );
        }, p.timeOut
    );
    
    res.locals = req.locals = p;
    
    // spam.pulse();
    
    // p.timing.stop( 'prep' );
    
    next();
}

module.exports = {
    initialize: s => {
        server = s;
    },
    prepare: () => {
        return prepare;
    }
};