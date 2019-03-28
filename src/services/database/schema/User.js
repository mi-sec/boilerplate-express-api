/** ****************************************************************************************************
 * File: User.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	mongoose = require( 'mongoose' ),
	Schema   = mongoose.Schema;

const userSchema = new Schema( {
	_id: Schema.Types.ObjectId,
	username: {
		type: String
	},
	password: {
		type: String
	},
	group: {
		type: String
	}
} );

userSchema.index(
	{ username: 1 },
	{ unique: true }
);

module.exports = mongoose.model(
	config.get( 'authentication.collectionName' ),
	userSchema
);
