/** ****************************************************************************************************
 * @file: Authentication.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig = require( 'gonfig' );

/**
 * authentication
 * @description
 * authentication wrapper to return the authentication class associated with the environment
 */
module.exports = gonfig.get( 'authentication' ) === 'LocalAuthentication' ?
	require( './LocalAuthentication' ) : null;
