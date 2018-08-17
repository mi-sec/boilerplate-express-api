/** ****************************************************************************************************
 * @file: methodNotAllowed.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /*</p>
 * @global
 *
 * @description
 * catchall endpoint for unsupported endpoint requests
 * @see {@link https://tools.ietf.org/html/rfc7231#section-6.5.5|RFC 7231 Section 6.5.5}
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/unknown
 * "Method: GET on /unknown not allowed"
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;

	return Promise.resolve( `Method: ${ req.method } on ${ req.path } not allowed` )
		.then( d => p.respond( new Response( 405, d ) ) )
		.catch( e => p.error( e ) );
};
