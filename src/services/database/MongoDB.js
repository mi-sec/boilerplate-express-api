/** ****************************************************************************************************
 * File: MongoDB.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	mongoose = require( 'mongoose' ),
	LightMap = require( '@parellin/lightmap' );

class MongoDB
{
	constructor()
	{
		this.connection  = mongoose.connection;
		this.collections = new LightMap( [
			[ 'user', require( './schema/User' ) ]
		] );
	}
	
	isConnected()
	{
		return this.connection.hasOwnProperty( 'name' );
	}
	
	async connect()
	{
		if( !this.isConnected() ) {
			await mongoose.connect(
				config.get( 'mongodb.uri' ),
				{
					useNewUrlParser: config.get( 'mongodb.useNewUrlParser' ),
					family: config.get( 'mongodb.ipFamily' ) || 4
				}
			);
		}
	}
	
	objectId()
	{
		return new mongoose.Types.ObjectId();
	}
}

module.exports = new MongoDB();
