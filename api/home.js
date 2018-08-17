/** ****************************************************************************************************
 * @file: home.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';
/*eslint valid-jsdoc: 0*/

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' );

/**
 * @name <p class="GET">GET: /</p>
 * @global
 *
 * @description
 * endpoint to get program name and version
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>} - returns request handler
 *
 * @example
 * curl 0.0.0.0:3000/
 * {"name": "boilerplate-express-api", "version": "0.0.0"}
 *
 * @since v0.0.0
 */
module.exports = ( req, res ) => {
	const p = res.locals;

	return Promise.resolve( gonfig.get( gonfig.sympkg ) )
		.then( ( { name, version } ) => p.respond( new Response( 200, { name, version } ) ) )
		.catch( e => p.error( e ) );
};
