/** ****************************************************************************************************
 * File: Shutdown.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 10-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = function shutdown( code ) {
    process.exit( code );
};