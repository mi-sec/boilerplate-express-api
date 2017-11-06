/** ****************************************************************************************************
 * File: prewarm.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    http     = require( 'http' ),
    config   = require( '../config' ),
    Response = require( 'http-response-class' );

function requestHTTP( options ) {
    return new Promise( ( rex, rev ) => {
        let body = '',
            req  = http.request( options, res => {
                res.on( 'data', chunk => body += chunk );
                res.on( 'end', () => rex( body ) );
                res.on( 'error', rev );
            } );
        
        req.on( 'error', rev );
        req.end();
    } );
}

module.exports = ( req, p ) => {
    return Promise.resolve( {
        host: 'localhost',
        port: config.port,
        path: '/ping'
    } )
        .then( requestHTTP )
        .then(
            d => p ? p.respond( new Response( 200, d ) ) : d
        )
        .catch(
            e => p ? p.error( e, 500 ) : e
        );
};