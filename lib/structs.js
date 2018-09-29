/** ****************************************************************************************************
 * @file: structs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	Response        = require( 'http-response-class' ),
	{ superstruct } = require( 'superstruct' ),
	struct          = superstruct( {
		types: {
			stringNumber: d => +d === d,
			'*': d => d === d
		}
	} );

/**
 * structs
 * @description
 * list of json structures used throughout the api
 * @mixin structs
 */
module.exports = {
	User: {
		username: 'string',
		password: 'string'
	},
	struct,
	validate: ( expected, data ) => new Promise(
		( res, rej ) => {
			const validation = struct( expected ).validate( data );
			if( validation[ 0 ] ) {
				rej( new Response( 417, { error: validation[ 0 ].message, expected } ) );
			} else {
				res( validation[ 1 ] );
			}
		}
	)
};
