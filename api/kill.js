/** ****************************************************************************************************
 * @file: kill.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	server   = require( '../server' ),
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /kill</p>
 * @global
 *
 * @description
 * endpoint to kill the running server (dangerous - for testing purposes only)
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/kill
 * "server terminated"
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;
	
	return Promise.resolve()
		.then( () => p.respond( new Response( 200, 'server terminated' ) ) )
		.then( () => server.shutdown( 0 ) )
		.catch( e => p.error( e ) );
};
