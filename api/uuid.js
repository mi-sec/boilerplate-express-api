/** ****************************************************************************************************
 * File: uuid.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
	return Promise.resolve( p.header.RequestID )
		.then( d => p.respond( new Response( 200, d ) ) )
		.catch( e => p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) ) );
};
