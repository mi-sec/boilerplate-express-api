/** ****************************************************************************************************
 * File: prewarm.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    { name } = require( '../config' ),
    Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
    return Promise.resolve( name )
        .then(
            d => p ? p.respond( new Response( 200, d ) ) : d
        )
        .catch(
            e => p ? p.error( e, 500 ) : e
        );
};