/** ****************************************************************************************************
 * File: stats.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    os = require( 'os' ),
    total = os.totalmem(),
    free = os.freemem(),
    used = total - free;
console.log( ( used / total ) * 100 );
console.log( require( 'os' ).hostname() );