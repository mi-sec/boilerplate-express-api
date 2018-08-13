/** ****************************************************************************************************
 * @file: captureErrors.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	UUIDv4   = require( 'uuid/v4' );

function captureErrors( e, req, res, next ) {
	if( e ) {
		const
			resp = new Response( e.statusCode || 500, e.stack || e.message || e ),
			data = JSON.stringify( resp.data );

		if( res.respond ) {
			res.respond( resp );
		} else {
			res
				.set( {
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Max-Age': 1728000,
					'Content-Type': 'application/json; charset=utf-8',
					'Content-Length': data.length,
					RequestID: UUIDv4()
				} )
				.status( resp.statusCode )
				.send( data );
		}
	} else {
		next();
	}
}

module.exports = () => {
	return captureErrors;
};

