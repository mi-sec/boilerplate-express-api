/** ****************************************************************************************************
 * File: permissions.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    KEYS = {
        SUB: '${sub}',
        rSUB: /\${sub}/ig,
        AUD: '${aud}',
        rAUD: /\${aud}/ig
    },
    PERMISSIONS = {
        ALL: {
            ALL: '',
            HOME: '',
            PING: ''
        },
        GET: {
            INFO: {
                SERVER: 'get:info:server'
            },
            USER: {
                PERMISSIONS: `get:user:permissions:${KEYS.SUB}`,
                VALID: 'get:user:valid'
            },
            DOCS: '',
            KILL: 'get:kill',
            UUID: '',
            VERSION: ''
        },
        POST: {
            USER: {
                CREATE: 'post:user:create',
                LOGIN: ''
            }
        }
    },
    DEFAULTS = {
        KEYS,
        ADMIN: [
            PERMISSIONS.GET.INFO.SERVER,
            PERMISSIONS.GET.USER.PERMISSIONS,
            PERMISSIONS.GET.KILL,
            PERMISSIONS.POST.USER.CREATE
        ],
        USER: [
            PERMISSIONS.GET.USER.PERMISSIONS,
            PERMISSIONS.GET.USER.VALID
        ]
    };

module.exports = {
    ...PERMISSIONS,
    ...DEFAULTS
};