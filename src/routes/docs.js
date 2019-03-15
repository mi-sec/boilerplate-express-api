/** ****************************************************************************************************
 * @file: docs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' );

module.exports.method = 'GET';
module.exports.route  = '/docs';
module.exports.exec   = ( req, res ) => {
	console.log( req );
	res.locals.respond( new Response( 200, '' ) );
};

