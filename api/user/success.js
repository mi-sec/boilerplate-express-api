/** ****************************************************************************************************
 * File: success.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 18-Aug-2018
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /user/success</p>
 * @global
 *
 * @description
 * // TODO: write description
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/user/success
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;
	
	// res.send("Welcome "+req.query.username+"!!")
	return Promise.resolve( 'pong' )
		.then( d => p.respond( new Response( 200, d ) ) )
		.catch( e => p.error( e ) );
};
