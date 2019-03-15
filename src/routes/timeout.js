/** ****************************************************************************************************
 * @file: timeout.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports.method = 'GET';
module.exports.route  = '/timeout/:time';
module.exports.exec   = async ( req, res ) => {
	const p = res.locals;
	
	p.clearTimeout();
	
	await new Promise( r => setTimeout( r, p.params.time * 1000 ) );
	
	p.respond( new Response( 408, 'Request Timeout' ) );
};
