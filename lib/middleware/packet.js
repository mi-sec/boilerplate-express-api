/** ****************************************************************************************************
 * File: prepare.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

// 2017-10-31T15:11:42.525Z [TRACE] [] [200] [::1] - 593 bytes | 7.796 ms | GET /?ok=true

const
    UUID     = require( 'uuid/v4' ),
    U        = require( '../util' ),
    Response = require( 'http-response-class' );

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
            data: typeof req.body === 'string' ? U.parse( req.body ) : req.body,
            timeOut: 20000,
            header: {},
            get: name => req.get( name ),
            options: null,
            ContentLength: null,
            ip: req.headers[ 'x-forwarded-for' ] || req.connection.remoteAddress,
            respond: function( msg = {}, statusCode = 200 ) {
                let
                    contentType,
                    data;
                
                if( U.isObject( msg ) && !U.isBuffer( msg ) ) {
                    contentType = 'application/json; charset=utf-8';
                    data = msg.toString();
                } else if( U.isBuffer( msg ) ) {
                    contentType = 'application/octet-stream';
                    data = msg;
                } else {
                    contentType = 'text/plain';
                    data = msg;
                }
                
                p.ContentLength = data.length;
                
                Object.assign( p.header, {
                    'Content-Type': contentType,
                    'Content-Length': data.length,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Max-Age': 1728000,
                    IP: p.ip,
                    RequestID: UUID()
                } );
                
                if( +p.req.httpVersion < 1.1 )
                    return p.error( new Response( 505, 'Upgrade Required' ) );
                
                p.res.set( p.header );
                p.res.status( msg.statusCode || statusCode ).send( data );
                p.kill();
            },
            error: function( err = {}, statusCode = 400 ) {
                if( err.stack )
                    if( !err.statusCode || err.statusCode === 500 || ( server.debug.returnStackTraces && err.stack ) )
                        err.stackTrace = err.stack;
                
                err.reason = err.reason || 'No reason provided';
                err.serviceName = p.service || 'unknown';
                
                if( err.deprecated )
                    err.deprecated = true;
                
                const data = err.toString();
                
                p.ContentLength = data.length;
                
                Object.assign( p.header, {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': data.length,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Max-Age': 1728000,
                    RequestID: UUID()
                } );
                
                p.res.set( p.header );
                p.res.status( err.statusCode || statusCode ).send( data );
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
    
    p.kill = () => {
        if( p )
            p.res.locals = p.req.locals = p = null;
    };
    
    setTimeout(
        () => {
            if( p )
                p.error( new Response( 408 ) );
        }, p.timeOut
    );
    
    res.locals = req.locals = p;
    
    // spam.pulse();
    
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