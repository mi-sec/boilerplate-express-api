/** ****************************************************************************************************
 * File: onStart.js
 * Project: melior
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config         = require( 'config' ),
	MongoDB        = require( '../services/database/MongoDB' ),
	Authentication = require( '../services/Authentication' ),
	{ waitFor }    = require( '../utils/kitchensink' );

module.exports = async () => {
	await waitFor( async () => {
		console.debug( 'waiting for mongo connection' );
		
		try {
			await MongoDB.connect();
		} finally {
			console.debug( 'waiting for mongo connection' );
		}
		
		return MongoDB.isConnected();
	}, 200, true );
	
	if( !await Authentication.userExists(
		config.get( 'authentication.superuser.username' )
	) ) {
		await Authentication.createUser(
			config.get( 'authentication.superuser.group' ),
			config.get( 'authentication.superuser.username' ),
			config.get( 'authentication.superuser.password' )
		);
	}
};
