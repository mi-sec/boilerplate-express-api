/** ****************************************************************************************************
 * File: server.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

const
	os          = require( 'os' ),
	cpus        = os.cpus(),
	bytesToSize = require( '../../lib/bytesToSize' ),
	Response    = require( 'http-response-class' );

module.exports = ( req, p ) => {
	return Promise.resolve()
		.then(
			() => (
				{
					platform: process.platform,
					nodeVersion: process.versions.node,
					openSSLVersion: process.versions.openssl,
					pid: process.pid,
					architecture: os.arch(),
					cpu: cpus[ 0 ].model,
					cores: cpus.length,
					clockSpeed: `${cpus.reduce( ( r, i ) => ( r += i.speed, r ), 0 ) / cpus.length} MHz`,
					totalMemory: bytesToSize( os.totalmem() )
				}
			)
		)
		.then(
			data => p.respond( new Response( 200, data ) )
		)
		.catch(
			e => p.error( new Response( 500, e.stackTrace || e.message ) )
		);
};
