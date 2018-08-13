/** ****************************************************************************************************
 * File: uuid.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	return Promise.resolve( res.header.RequestID )
		.then( d => res.respond( new Response( 200, d ) ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
