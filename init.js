/** ****************************************************************************************************
 * @file: init.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' ),
	lanIp  = require( './lib/lanIp' );

module.exports = async () => {
	await gonfig.set( 'lanip', lanIp );
};
