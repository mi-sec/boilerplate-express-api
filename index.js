/** ****************************************************************************************************
 * File: index.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-OCT-2017
 * @version 0.0.0
 *******************************************************************************************************/
'use strict';
// @formatter:off

const prewarm = require( './api/prewarm' );

require( './server' )()
    .initialize()
    .then( inst => inst.start() )
    .then( () => prewarm() );