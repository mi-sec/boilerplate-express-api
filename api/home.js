/** ****************************************************************************************************
 * @file: home.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 06-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' );

/**
 *
 * @param req
 * @param res
 * @return {Promise<{name: *, version: *} | never>}
 */
module.exports = ( req, res ) => {
	const p = res.locals;
	
	return Promise.resolve( gonfig.get( gonfig.sympkg ) )
		.then( ( { name, version } ) => p.respond( new Response( 200, { name, version } ) ) )
		.catch(
			e => e instanceof Response ?
				p.respond( e ) :
				p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) )
		);
};
