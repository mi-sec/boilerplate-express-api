/** ****************************************************************************************************
 * File: kill.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' ),
    { cyan } = require( 'ansi-styles' ),
    Shutdown = require( '../lib/Shutdown' );

module.exports = ( req, p ) => {
    return Promise.resolve()
        .then(
            () => p.respond( new Response( 200, 'Server closed' ) )
        )
        .then(
            () => {
                console.log( cyan.open + 'commencing graceful exit...' + cyan.close );
                return new Promise(
                    res => setTimeout(
                        () => {
                            Shutdown( 0 );
                            res();
                        },
                        1000
                    )
                );
            }
        )
        .catch(
            e => p.error( e, 500 )
        );
};