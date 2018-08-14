/** ****************************************************************************************************
 * File: version.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';

const
	gonfig   = require( 'gonfig' ),
	Response = require( 'http-response-class' );

module.exports = ( req, p ) => {
	return Promise.resolve( gonfig.get( gonfig.sympkg ) )
		.then( ( { version } ) => p.respond( new Response( 200, `v${ version }` ) ) )
		.catch( e => p.respond( new Response( e.statusCode || 500, e.data || e.stack || e.message || e ) ) );
};
