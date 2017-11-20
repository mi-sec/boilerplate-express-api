/** ****************************************************************************************************
 * File: methodNotSupported.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' ),
    { api }  = require( '../config' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => {
                const
                    methods = Object.keys( api ).reduce(
                        ( r, i ) => {
                            r.push( api[ i ].method + ' ' + api[ i ].route );
                            return r;
                        }, []
                    );
                
                // DO NOT DELETE: Compliance requirement: RFC2616 10.4.7
                p.header.Allow = methods.join( ', ' );
                p.header[ 'Cache-Control' ] = 'max-age=600';
                
                p.respond( new Response( 405, `Method: ${req.path} not allowed` ) );
            }
        )
        .catch(
            e => p.error( new Response( 501, e ) )
        );
};