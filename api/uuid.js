/** ****************************************************************************************************
 * @file: uuid.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /uuid</p>
 * @global
 *
 * @description
 * endpoint for retrieving a UUIDv4
 * @see {@link https://tools.ietf.org/html/rfc4122#section-4.4|RFC 4122 Section 4.4}
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/uuid
 * "36d0f859-a1fd-462b-b486-a8ede9a991e4"
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;

	return Promise.resolve( p.headers.RequestID )
		.then( d => p.respond( new Response( 200, d ) ) )
		.catch( e => p.error( e ) );
};
