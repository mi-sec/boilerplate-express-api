/** ****************************************************************************************************
 * File: acl.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	Response = require( 'http-response-class' );

function acl( req, res, next ) {
	req.log.trace( '[middleware] acl' );
	
	next();
}

module.exports = () => acl;
