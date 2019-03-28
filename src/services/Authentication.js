/** ****************************************************************************************************
 * File: Authentication.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config        = require( 'config' ),
	argon2        = require( 'argon2' ),
	Response      = require( 'http-response-class' ),
	MongoDB       = require( './database/MongoDB' ),
	Authorization = require( './Authorization' ),
	{
		testMinimumLength,
		testUppercase,
		testLowercase,
		testDigitcase,
		testSpecialcase
	}             = require( '../utils/kitchensink' );

class Authentication
{
	constructor()
	{
		this.collectionName = config.get( 'authentication.collectionName' );
		this.passwordOpts   = config.get( 'authentication.passwordRequirements' );
	}
	
	/**
	 * @method checkPasswordStrength
	 * @description
	 * validate password against a series of strength checks
	 * @param {string} password - password
	 * @property {number} opts.length - the length minimum of a password
	 * @property {number} opts.uppercase - the uppercase character minimum of a password
	 * @property {number} opts.lowercase - the lowercase character minimum of a password
	 * @property {number} opts.digits - the digits character minimum of a password
	 * @property {number} opts.special - the special character minimum of a password
	 */
	passwordRequirements( password )
	{
		let err = null;
		
		if( !testMinimumLength( password, this.passwordOpts.length ) ) {
			err = `Password must be ${ this.passwordOpts.length } characters or more`;
		} else if( !testUppercase( password, this.passwordOpts.uppercase ) ) {
			err = `Password must contain ${ this.passwordOpts.uppercase } or more uppercase characters`;
		} else if( !testLowercase( password, this.passwordOpts.lowercase ) ) {
			err = `Password must contain ${ this.passwordOpts.lowercase } or more lowercase characters`;
		} else if( !testDigitcase( password, this.passwordOpts.digits ) ) {
			err = `Password must contain ${ this.passwordOpts.digits } or more numbers`;
		} else if( !testSpecialcase( password, this.passwordOpts.special ) ) {
			err = `Password must contain ${ this.passwordOpts.special } or more special characters`;
		}
		
		if( err ) {
			throw new Response( 417, err );
		}
	}
	
	async signIn( username, password )
	{
		this.passwordRequirements( password );
		
		const User = MongoDB.collections.get( this.collectionName );
		
		let doc = User.find( { username } );
		
		doc = await doc.exec();
	}
	
	async userExists( username )
	{
		const User = MongoDB.collections.get( this.collectionName );
		
		let doc = User.findOne( { username } );
		doc     = doc.select( '_id' );
		doc     = await doc.exec();
		
		return !!doc;
	}
	
	async createUser( group, username, password )
	{
		if( !Authorization.hasGroup( group ) ) {
			throw new Error( `Group ${ group } does not exist` );
		}
		
		if( await this.userExists( username ) ) {
			throw new Error( `${ username } already exists` );
		}
		
		const User = MongoDB.collections.get( this.collectionName );
		
		const doc = new User( {
			_id: MongoDB.objectId(),
			group,
			username,
			password
		} );
		
		try {
			await doc.validate();
		} catch( e ) {
			return e;
		}
		
		return await doc.save();
	}
}

module.exports = new Authentication();
