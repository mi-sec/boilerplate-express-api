/** ****************************************************************************************************
 * File: process.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    pkg        = require( './package.json' ),
    pm2        = require( 'pm2' ),
    connect    = () => new Promise(
        ( res, rej ) => pm2.connect(
            ( e, d ) => e ? rej( e ) : res( d )
        )
    ),
    disconnect = () => Promise.resolve( pm2.disconnect() ),
    start      = app => new Promise(
        ( res, rej ) => pm2.start(
            app,
            ( e, apps ) => e ? rej( e ) : res( apps )
        )
    ),
    exit       = code => process.exit( code ),
    app        = {
        name: pkg.name,
        script: pkg.main,
        version: pkg.version,
        exec_mode: 'cluster',
        instances: 0,
        maxMemoryRestart: '200M',
        restartDelay: 5000
    };

connect()
    .then(
        () => start( app )
    )
    .then(
        () => disconnect()
    )
    .then(
        () => exit( 0 )
    )
    .catch(
        () => exit( 2 )
    );