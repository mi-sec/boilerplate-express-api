/** ****************************************************************************************************
 * @file: captureParameters.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	debug = require( '../debug' );

function captureParams( req, res, next ) {
	debug( '[middleware] captureParameters' );

	res.locals.params = req.params;

	next();
}

module.exports = () => {
	return captureParams;
};
