/** ****************************************************************************************************
 * File: prepare.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

// 2017-10-31T15:11:42.525Z [TRACE] [] [200] [::1] - 593 bytes | 7.796 ms | GET /?ok=true

const
    UUIDv4            = require( 'uuid/v4' ),
    Response          = require( 'http-response-class' ),
    U                 = require( '../util' ),
    getIP             = require( './getIP' ),
    findKeyInObj      = ( obj, rx ) => obj[ Object.keys( obj ).filter( i => rx.test( i ) ) ],
    findAuthorization = obj => findKeyInObj( obj, /authorization/i ),
    findApiCode       = obj => findKeyInObj( obj, /api_?key/i ),
    findUsername      = obj => findKeyInObj( obj, /username/i ),
    findPassword      = obj => findKeyInObj( obj, /password/i );

let server;

function prepare( req, res, next ) {
    Object.keys( req.headers )
        .forEach(
            hdr => req.headers[ hdr ] = decodeURI( req.headers[ hdr ] )
        );
    
    let p = {
        config: null,
        service: null,
        data: typeof req.body === 'string' ? U.parse( req.body ) : req.body,
        timeOut: 20000,
        header: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Max-Age': 1728000,
            'Content-Type': 'application/json; charset=utf-8',
            RequestID: UUIDv4()
        },
        get: name => req.get( name ),
        options: null,
        ContentLength: null,
        IP: getIP( req ),
        respond: ( msg = {}, statusCode = 200 ) => {
            let
                contentType,
                data;
            
            if( U.isObject( msg ) && !U.isBuffer( msg ) ) {
                contentType = 'application/json; charset=utf-8';
                data        = msg.toString();
            } else if( U.isBuffer( msg ) ) {
                contentType = 'application/octet-stream';
                data        = msg;
            } else {
                contentType = 'text/plain';
                data        = msg;
            }
            
            p.ContentLength = data.length;
            
            Object.assign( p.header, {
                'Content-Type': contentType,
                'Content-Length': data.length
            } );
            
            if( +p.req.httpVersion < 1.1 )
                return p.error( new Response( 505, 'Upgrade Required' ) );
            
            p.res.set( p.header );
            p.res.status( msg.statusCode || statusCode ).send( data );
            p.kill();
        },
        error: ( err = {}, statusCode = 400 ) => {
            if( err.stack )
                if( !err.statusCode || err.statusCode === 500 || ( server.debug.returnStackTraces && err.stack ) )
                    err.stackTrace = err.stack;
            
            const data = err.toString();
            
            err.reason      = err.reason || 'No reason provided';
            err.serviceName = p.service || err.origin || 'unknown';
            
            if( err.deprecated )
                err.deprecated = true;
            
            p.ContentLength = data.length;
            
            Object.assign( p.header, {
                'Content-Length': data.length
            } );
            
            p.res.set( p.header );
            p.res.status( err.statusCode || statusCode ).send( data );
            p.kill();
        }
    };
    
    const combined = { ...req.params, ...req.query, ...p.data, ...req.headers };
    
    p.authorization = findAuthorization( combined ) || null;
    p.apikey        = findApiCode( combined ) || null;
    p.username      = findUsername( combined ) || null;
    p.password      = findPassword( combined ) || null;
    
    p.hasAuthorization = !!p.authorization;
    p.hasApiKey        = !!p.apikey;
    
    U.defineProperty( p, 'req', () => req );
    U.defineProperty( p, 'res', () => res );
    U.defineProperty( p, 'params', () => req.params );
    U.defineProperty( p, 'query', () => req.query );
    U.defineProperty( p, 'headers', () => req.headers );
    
    p.kill = () => {
        if( p )
            p.res.locals = p.req.locals = p = null;
    };
    
    setTimeout(
        () => {
            if( p )
                p.error( new Response( 408 ) );
        },
        p.timeOut
    );
    
    res.locals = req.locals = p;
    
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