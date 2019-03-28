/** ****************************************************************************************************
 * File: default.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	{ join }          = require( 'path' ),
	{ name, version } = require( '../package' );

process.title = `${ name }-v${ version }`;

module.exports = {
	name,
	version: `v${ version }`,
	title: process.title,
	server: {
		host: '0.0.0.0',
		port: 3000,
		logger: {
			maxPacketCapture: 5
		},
		routes: join( process.cwd(), 'src', 'routes' ),
		packet: {
			timeout: 20000,
			dotfiles: 'allow'
		}
	},
	
	mongodb: {
		uri: 'mongodb://localhost:27017/api',
		ipFamily: 4,
		useNewUrlParser: true
	},
	
	authentication: {
		collectionName: 'user',
		superuser: {
			group: 'admin',
			username: 'admin',
			password: 'password'
		},
		passwordRequirements: {
			length: 8,
			uppercase: 2,
			lowercase: 2,
			digits: 1,
			special: 1
		}
	},
	
	authorization: {
		collectionName: 'group',
		groups: [
			{
				group: 'admin',
				permissions: [
					{
						effect: 'allow',
						action: '*',
						resource: '*'
					}
				]
			},
			{
				group: 'user',
				permissions: [
					{
						effect: 'deny',
						action: [ 'POST', 'GET', 'PUT' ],
						resource: 'users/'
					}
				]
			},
			{
				group: '*',
				permissions: [
					{
						effect: 'allow',
						action: '*',
						resource: '/'
					}
				]
			}
		]
	}
	
};
