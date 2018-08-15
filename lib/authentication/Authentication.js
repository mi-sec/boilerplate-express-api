/** ****************************************************************************************************
 * @file: Authentication.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const gonfig = require( 'gonfig' );

module.exports = gonfig.get( 'authentication' ) === 'LocalAuthentication' ?
	require( './LocalAuthentication' ) : null;
