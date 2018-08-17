/** ****************************************************************************************************
 * @file: ping.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /ping</p>
 * @global
 *
 * @description
 * endpoint for testing availability and benchmarking the API
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/ping
 * "pong"
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;
	
	return Promise.resolve( 'pong' )
		.then( d => p.respond( new Response( 200, d ) ) )
		.catch( e => p.error( e ) );
};
