/** ****************************************************************************************************
 * @file: home.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	{ name, version } = require( 'config' ),
	Response          = require( 'http-response-class' );

/**
 *
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @return {Promise<{name: *, version: *} | never>}
 */
module.exports.method = 'GET';
module.exports.route = '/';
module.exports.exec  = ( req, res ) => {
	const p = res.locals;
	p.respond( new Response( 200, { name, version } ) );
};
