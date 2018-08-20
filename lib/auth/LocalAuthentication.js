/** ****************************************************************************************************
 * @file: LocalAuthentication.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	LightMap      = require( '@parellin/lightmap' ),
	Response      = require( 'http-response-class' ),
	gonfig        = require( 'gonfig' ),
	{ writeJson } = require( 'fs-extra' );

class LocalAuthentication
{
	constructor()
	{
		this.users = new LightMap( gonfig.get( 'users' ) );
	}
	
	async signUp( data )
	{
		return Promise.resolve( data )
			.then( d => !this.users.has( d.username ) ? d : Promise.reject( 'username already exists' ) )
			.then( d => this.users.set( d.username, d ) )
			.then( () => writeJson( gonfig.get( 'users' ), this.users ) )
			.then( () => Promise.resolve( 'user created' ) );
	}
	
	async login( data )
	{
		return Promise.resolve( data )
			.then( d => this.users.has( d.username ) ? d : Promise.reject( 'username not found' ) );
	}
}

module.exports = new LocalAuthentication();
