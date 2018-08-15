/** ****************************************************************************************************
 * @file: structs.js
 * @project: boilerplate-express-api
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

module.exports = {
	User: {
		username: 'string',
		password: 'string'
	},
	struct,
	validate: ( expected, data ) => new Promise(
		( res, rej ) => {
			const validataion = struct( expected ).validate( data );
			if( validataion[ 0 ] ) {
				rej( new Response( 417, { error: validataion[ 0 ].message, expected } ) );
			} else {
				res( validataion[ 1 ] );
			}
		}
	)
};
