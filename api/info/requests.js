/** ****************************************************************************************************
 * File: requests.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' ),
    probe    = require( 'pmx' ).probe(),
    requests = probe.meter( {
        name: 'requestsPerSecond',
    } );

module.exports = ( req, p ) => {
    console.log( requests );
    
    return Promise.resolve()
        .then(
            () => p.respond( new Response( 200, 'ok' ) )
        )
        .catch(
            e => p.error( new Response( 500, e ) )
        );
};