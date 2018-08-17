/** ****************************************************************************************************
 * @file: api.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Aug-2018
 *******************************************************************************************************/
'use strict';

module.exports = [
	{
		route: '/',
		method: 'GET',
		exec: require( '../api/home' )
	},
	{
		route: '/kill',
		method: 'GET',
		exec: require( '../api/kill' )
	},
	{
		route: '/docs',
		method: 'GET',
		exec: require( '../api/docs' )
	},
	{
		route: '/ping',
		method: 'GET',
		exec: require( '../api/ping' )
	},
	{
		route: '/timeout/:time',
		method: 'GET',
		exec: require( '../api/timeout' )
	},
	{
		route: '/uuid',
		method: 'GET',
		exec: require( '../api/uuid' )
	},
	{
		route: '/version',
		method: 'GET',
		exec: require( '../api/version' )
	},
	{
		route: '/user/signup',
		method: 'POST',
		exec: require( '../api/user/signup' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: require( '../api/methodNotAllowed' )
	}
];
