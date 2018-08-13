/** ****************************************************************************************************
 * File: methodNotAllowed.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';

const Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	return Promise.resolve( `Method: ${ req.method } on ${ req.path } not allowed` )
		.then( d => res.respond( new Response( 405, d ) ) )
		.catch( e => res.respond( new Response( e.statusCode || 500, e.stack || e.message || e ) ) );
};
