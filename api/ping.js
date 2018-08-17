/** ****************************************************************************************************
 * @file: ping.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	const p = res.locals;
	
	return Promise.resolve( 'pong' )
		.then( d => p.respond( new Response( 200, d ) ) )
		.catch(
			e => e instanceof Response ?
				p.respond( e ) :
				p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) )
		);
};
