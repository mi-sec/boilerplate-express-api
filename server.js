/** ****************************************************************************************************
 * File: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    express        = require( 'express' ),
    bodyParser     = require( 'body-parser' );

class Server
{
    constructor( config )
    {
        this.debug = {
            returnStackTraces: true,
            trace: false
        };
    
        this.config = typeof config === 'string' ? require( config ) : config;
        this.errors = e;
    }
}