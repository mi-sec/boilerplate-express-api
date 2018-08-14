/** ****************************************************************************************************
 * @file: timeout.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
	p.clearTimeout();
	return Promise.resolve( p.params.time * 1000 )
		.then( d => new Promise( r => setTimeout( r, d ) ) )
		.then( () => p.respond( new Response( 408, 'Request Timeout' ) ) )
		.catch(
			e => e instanceof Response ?
				p.respond( e ) :
				p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) )
		);
};
