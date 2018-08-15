/** ****************************************************************************************************
 * @file: debug.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const gonfig = require( 'gonfig' );

module.exports = msg => {
	if( gonfig.log === gonfig.LEVEL.VERBOSE ) {
		console.log( msg );
	}
};

