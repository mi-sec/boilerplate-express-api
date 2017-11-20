/** ****************************************************************************************************
 * File: config.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    {
        version,
        name
    }           = require( './package.json' ),
    { resolve } = require( 'path' ),
    UUIDv5      = require( 'uuid/v5' ),
    spamming    = require( './config/spamming' ),
    PERMISSIONS = require( './config/permissions' ),
    config      = {
        [Symbol.toStringTag]() {
            return this.constructor.name;
        },
        [Symbol.toPrimitive]( n ) {
            if( n === 'string' )
                return '' + this;
            else if( n === 'number' )
                return +this;
            else if( n === 'boolean' )
                return !!this;
            else if( n === 'function' )
                return ( () => {
                } );
            else
                return true;
        },
        name,
        version,
        cwd: process.cwd(),
        host: 'localhost',
        port: 1234,
        JWT: {
            AUD: '3af966a5-12b1-44de-8844-ae259a918ec3',
            ISS: UUIDv5( name, UUIDv5.URL ),
            EXPIRE: 60 * 60 // 1h
        },
        masterKey: '',
        timestamp: '',
        mongodb: {
            protocol: 'mongodb://',
            host: 'localhost',
            port: 27017
        },
        spamming,
        api: {
            '/': {
                route: '/',
                method: 'ALL',
                permissions: PERMISSIONS.ALL.HOME,
                exec: resolve( './api/home.js' )
            },
            '/ping': {
                route: '/ping',
                method: 'ALL',
                permissions: PERMISSIONS.ALL.PING,
                exec: resolve( './api/ping.js' )
            },
            '/kill': {
                route: '/kill',
                method: 'GET',
                permissions: PERMISSIONS.GET.KILL,
                exec: resolve( './api/kill.js' )
            },
            '/docs': {
                route: '/docs',
                method: 'GET',
                permissions: PERMISSIONS.GET.DOCS,
                exec: resolve( './api/docs.js' )
            },
            '/uuid': {
                route: '/uuid',
                method: 'GET',
                permissions: PERMISSIONS.GET.UUID,
                exec: resolve( './api/uuid.js' )
            },
            '/version': {
                route: '/version',
                method: 'GET',
                permissions: PERMISSIONS.GET.VERSION,
                exec: resolve( './api/version.js' )
            },
            '/user/create': {
                route: '/user/create',
                method: 'POST',
                permissions: PERMISSIONS.POST.USER.CREATE,
                exec: resolve( './api/user/createUser.js' )
            },
            '/user/login': {
                route: '/user/login',
                method: 'POST',
                permissions: PERMISSIONS.POST.USER.LOGIN,
                exec: resolve( './api/user/login.js' )
            },
            '/user/:sub': {
                route: '/user/:sub',
                method: 'GET',
                permissions: PERMISSIONS.GET.USER.PERMISSIONS,
                exec: resolve( './api/user/getPermissions.js' )
            },
            '/info/server': {
                route: '/info/server',
                method: 'GET',
                permissions: PERMISSIONS.GET.INFO.SERVER,
                exec: resolve( './api/info/server.js' )
            },
            '*': {
                route: '*',
                method: 'ALL',
                permissions: PERMISSIONS.ALL.ALL,
                exec: resolve( './api/methodNotAllowed.js' )
            }
        },
        exitCodes: {
            0: 'exiting, no errors, shutting down...',
            1: 'exiting, unknown errors',
            2: 'error connecting to MongoDB',
            3: 'error connecting to DynamoDB'
        },
        useTLS: false,
        forceRedirect: true
    },
    handler     = {
        get( t, k, r ) {
            return Reflect.get( t, k, r );
        },
        set( t, k, v, r ) {
            return Reflect.set( t, k, v, r );
        }
    };

config.initializationMessage = `Server v${config.version} running on Port: ${config.port}`;

module.exports = new Proxy( config, handler );