/** ****************************************************************************************************
 * File: authLevels.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = {
    LEVEL: {
        SUPER: 0,
        ADMIN: 1,
        GROUP: 2,
        NONE: 10
    },
    TYPE: {
        MASTERKEY: 0,
        APIKEY: 1,
        LOGIN: 2,
        CERT: 3,
        NONE: 10
    }
};