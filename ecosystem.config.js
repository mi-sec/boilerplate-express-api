/** ****************************************************************************************************
 * @file: ecosystem.config.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	{ name, main: script } = require( './package' ),
	development            = process.argv.includes( 'development' );

module.exports = {
	apps: [
		{
			name,
			script,
			exec_mode: 'cluster',
			instances: development ? 1 : 'max',
			autorestart: true,
			restartDelay: 5000,
			max_memory_restart: '1G',
			node_args: [
				'--no-warnings',
				'--max_old_space_size=1024'
			],
			env: {
				NODE_ENV: 'development'
			},
			env_development: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
