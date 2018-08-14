/** ****************************************************************************************************
 * @file: init.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig         = require( 'gonfig' ),
	lanIp          = require( './lib/lanIp' ),
	{ outputJson } = require( 'fs-extra' ),
	{
		resolve,
		join
	}              = require( 'path' ),
	datapath       = resolve( './data' ),
	users          = join( datapath, 'users.json' );

module.exports = async () => {
	await gonfig.set( 'lanip', lanIp );

	gonfig.set( 'datapath', datapath );
	gonfig.set( 'users', users );

	try {
		await outputJson( users, [] );
	} catch( e ) {
		console.error( e );
	}
};
