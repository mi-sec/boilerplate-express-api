/** ****************************************************************************************************
 * @file: api.js
 * @project: node-docker
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Jul-2018
 *******************************************************************************************************/
'use strict';

const { resolve } = require( 'path' );

module.exports = [
	{
		route: '/',
		method: 'GET',
		exec: resolve( './api/home' )
	},
	{
		route: '/kill',
		method: 'GET',
		exec: resolve( './api/kill' )
	},
	{
		route: '/ping',
		method: 'GET',
		exec: resolve( './api/ping' )
	},
	{
		route: '/timeout/:time',
		method: 'GET',
		exec: resolve( './api/timeout' )
	},
	{
		route: '/uuid',
		method: 'GET',
		exec: resolve( './api/uuid' )
	},
	{
		route: '/version',
		method: 'GET',
		exec: resolve( './api/version' )
	},
	{
		route: '/user/signup',
		method: 'POST',
		exec: resolve( './api/user/signup' )
	},
	{
		route: '*',
		method: 'ALL',
		exec: resolve( './api/methodNotAllowed' )
	}
];
