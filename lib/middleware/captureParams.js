/** ****************************************************************************************************
 * @file: captureParameters.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	debug = require( '../debug' );

/**
 * captureParams
 * @description
 * hook post-parsed parameters captured by express from the URI
 * @param {http.Request} req - HTTP Request
 * @param {http.Response} res - HTTP Response
 * @param {function} next - next middleware function
 */
function captureParams( req, res, next ) {
	debug( '[middleware] captureParameters' );

	res.locals.params = req.params;

	next();
}

module.exports = () => {
	return captureParams;
};
