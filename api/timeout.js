/** ****************************************************************************************************
 * @file: timeout.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /timeout/:time</p>
 * @global
 *
 * @description
 * endpoint to test timeout
 * primarily used for front end developer tests
 * @see {@link https://tools.ietf.org/html/rfc7231#section-6.5.7|RFC 7231 Section 6.5.7}
 * @see {@link https://tools.ietf.org/html/rfc7230#section-6.1|RFC 7230 Section 6.1}
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/timeout/20
 * "Request Timeout"
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;

	p.clearTimeout();

	return Promise.resolve( +p.params.time * 1000 )
		.then( d => new Promise( r => setTimeout( r, d ) ) )
		.then( () => p.respond( new Response( 408, 'Request Timeout' ) ) )
		.catch( e => p.error( e ) );
};
