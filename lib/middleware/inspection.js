/** ****************************************************************************************************
 * @file: inspection.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response = require( 'http-response-class' ),
	gonfig   = require( 'gonfig' ),
	{
		maximumURISize,
		maximumHeaderSize,
		maximumPayloadSize,
		minimumHTTPVersion
	}        = gonfig.get( 'server' );

function inspection( req, res, next ) {
	if( `${ req.protocol }://${ req.hostname }${ req.path }`.length >= maximumURISize ) {
		return res.locals.respond( new Response( 414, 'URI exceeds maximum length' ) );
	} else if( req.rawHeaders.join( '' ).length >= maximumHeaderSize ) {
		return res.locals.respond( new Response( 431, 'Request Header Fields Too Large' ) );
	} else if( req.headers[ 'content-length' ] >= maximumPayloadSize ) {
		return res.locals.respond( new Response( 413, 'Payload Too Large' ) );
	} else if( +req.httpVersion < minimumHTTPVersion ) {
		return res.locals.respond( new Response( 505, 'HTTP Version Not Supported' ) );
	}

	next();
}

module.exports = () => {
	return inspection;
};
