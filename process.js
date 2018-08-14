/** ****************************************************************************************************
 * File: process.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	pm2    = require( 'pm2' ),
	config = require( './ecosystem.config' );

pm2.connect( err => {
	if( err ) {
		console.error( err );
		process.exit( 2 );
	}
	
	for( let i = 0; i < config.apps.length; i++ ) {
		pm2.start( config.apps[ i ],
			( err, apps ) => {
				if( err ) {
					throw err;
				}
				
				console.log( apps );
				
				pm2.disconnect();
			}
		);
	}
} );
