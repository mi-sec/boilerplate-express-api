/** ****************************************************************************************************
 * @file: ecosystem.config.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	{ name, main: script } = require( './package' ),
	isProduction           = process.argv.includes( 'production' );

module.exports = {
	apps: [
		{
			name,
			script,
			exec_mode: 'cluster',
			instances: isProduction ? 0 : 1,
			instance_var: 'INSTANCE_ID',
			wait_ready: true,
			autorestart: isProduction,
			restartDelay: 5000,
			watch: !isProduction,
			max_memory_restart: '1G',
			node_args: [
				'--no-warnings',
				'--max_old_space_size=4096'
			],
			env: {
				NODE_ENV: 'development'
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
