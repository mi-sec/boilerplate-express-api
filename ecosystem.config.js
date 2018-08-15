/** ****************************************************************************************************
 * @file: ecosystem.config.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const { name, main: script } = require( './package' );

module.exports = {
	apps: [
		{
			name,
			script,
			exec_mode: 'cluster',
			instances: 0,
			max_memory_restart: '4G',
			restartDelay: 5000,
			node_args: '--no-warnings',
			error_file: 'logs/err.log',
			out_file: 'logs/out.log',
			env: {
				NODE_ENV: 'development',
				DEBUG: true
			},
			env_production: {
				NODE_ENV: 'production'
			}
		}
	]
};
