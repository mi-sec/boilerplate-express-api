/** ****************************************************************************************************
 * @file: debug.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' );

/**
 * debug
 * @description
 * log wrapper if the API is in VERBOSE mode
 * @param {*} msg - item to log
 * @mixin debug
 */
module.exports = msg => {
	if( gonfig.log === gonfig.LEVEL.VERBOSE || process.env.DEBUG === 'true' ) {
		console.log( msg );
	}
};
