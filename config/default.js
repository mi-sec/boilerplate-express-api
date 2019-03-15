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
	}
};
