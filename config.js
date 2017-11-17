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
    config      = {
        [Symbol.toStringTag]() {
            return this.constructor.name;
        },
        [Symbol.toPrimitive]( n ) {
            console.log( n, this );
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
            ISS: UUIDv5( name, UUIDv5.URL )
        },
        mongodb: {
            protocol: 'mongodb://',
            host: 'localhost',
            port: 27017,
            masterKey: '',
            timestamp: ''
        },
        spamming: {
            origin: 'Spam Filter',
            clearJailsFrequency: 500,
            allowReleaseFromJailAfter: 2000,
            clearPrisonsFrequency: 10000,
            allowReleaseFromPrisonAfter: 50000,
            imprisonAfter: 3,
            sentencingCooldown: 5000,
            ddosDefense: {
                limit: 20,
                infraction: 'DDoS Attempt',
                errorCode: 503,
                message: 'You have been flagged as a spammer and must contact an administrator.'
            },
            spammingDefense: {
                limit: 10,
                RetryAfter: 2000,
                infraction: 'Spamming Infraction',
                errorCode: 429,
                message: 'Spamming attempt caught'
            }
        },
        api: {
            home: {
                route: '/',
                method: 'ALL',
                exec: resolve( './api/home.js' )
            },
            ping: {
                route: '/ping',
                method: 'ALL',
                exec: resolve( './api/ping.js' )
            },
            kill: {
                route: '/kill',
                method: 'ALL',
                exec: resolve( './api/kill.js' )
            },
            docs: {
                route: '/docs',
                method: 'GET',
                exec: resolve( './api/docs.js' )
            },
            uuid: {
                route: '/uuid',
                method: 'GET',
                exec: resolve( './api/uuid.js' )
            },
            version: {
                route: '/version',
                method: 'GET',
                exec: resolve( './api/version.js' )
            },
            userLogin: {
                route: '/user/login',
                method: 'POST',
                exec: resolve( './api/user/login.js' )
            },
            createUser: {
                route: '/user/create',
                method: 'POST',
                exec: resolve( './api/user/createUser.js' )
            },
            infoRequests: {
                route: '/info/requests',
                method: 'ALL',
                exec: resolve( './api/info/requests.js' )
            },
            infoServer: {
                route: '/info/server',
                method: 'GET',
                exec: resolve( './api/info/server.js' )
            },
            catchAll: {
                route: '*',
                method: 'ALL',
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