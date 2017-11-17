/** ****************************************************************************************************
 * File: authTypes.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = {
    PERMISSIONS: {
        NONE: [],
        ADMIN: [ 'all:admin' ],
        GET: {
            ADMIN: [ 'get:admin' ],
        },
        POST: {
            ADMIN: [ 'post:admin' ],
            USER: {
                CREATE: [ 'post:user:create' ]
            }
        }
    }
};