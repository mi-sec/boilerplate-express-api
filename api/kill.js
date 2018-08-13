/** ****************************************************************************************************
 * File: kill.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	server   = require( '../server' ),
	Response = require( 'http-response-class' );

module.exports = ( req, res ) => {
	res.respond( new Response( 200, 'server terminated' ) );
	server.shutdown( 0 );
};
