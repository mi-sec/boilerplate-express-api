/** ****************************************************************************************************
 * @file: stats.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	Response        = require( 'http-response-class' ),
	os              = require( 'os' ),
	cpus            = os.cpus(),
	{ bytesToSize } = require( '../../utils/kitchensink' );

module.exports.method = 'GET';
module.exports.route  = '/info/stats';
module.exports.exec   = ( req, res ) => {
	const p = res.locals;
	p.respond( new Response( 200, {
		platform: process.platform,
		nodeVersion: process.versions.node,
		openSSLVersion: process.versions.openssl,
		pid: process.pid,
		architecture: os.arch(),
		cpu: cpus[ 0 ].model,
		cores: cpus.length,
		clockSpeed: `${ cpus.reduce( ( r, i ) => ( r += i.speed, r ), 0 ) / cpus.length } MHz`,
		totalMemory: bytesToSize( os.totalmem() )
	} ) );
};
