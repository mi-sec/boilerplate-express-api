/** ****************************************************************************************************
 * @file: kill.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	server   = require( '../lib/server' ),
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	const p = res.locals;
	
	return Promise.resolve()
		.then( () => res.respond( new Response( 200, 'server terminated' ) ) )
		.then( () => server.shutdown( 0 ) )
		.catch(
			e => e instanceof Response ?
				p.respond( e ) :
				p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) )
		);
};
