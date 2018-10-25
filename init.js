/** ****************************************************************************************************
 * @file: init.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig         = require( 'gonfig' ),
	lanIp          = require( './lib/lanIp' ),
	{ ensureFile } = require( 'fs-extra' ),
	{ resolve }    = require( 'path' );

const
	logpath = resolve( './logs' );

module.exports = async () => {
	// get the local ip
	gonfig.set( 'lanip', lanIp );
	
	// set log path
	gonfig.set( 'logpath', logpath );
	
	await ensureFile( logpath );
};
