/** ****************************************************************************************************
 * File: Authorization.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 28-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	config   = require( 'config' ),
	LightMap = require( '@parellin/lightmap' );

class Authorization
{
	constructor()
	{
		this.groups = new LightMap();
		
		const configGroups = config.get( 'authorization.groups' );
		
		configGroups.forEach(
			item => this.createGroup( item.group, item.permissions )
		);
	}
	
	hasGroup( name )
	{
		return this.groups.has( name );
	}
	
	getGroup( name )
	{
		return this.groups.get( name );
	}
	
	createGroup( name, permissions )
	{
		return this.groups.set( name, permissions );
	}
	
	deleteGroup( name )
	{
		return this.groups.delete( name );
	}
	
	updateGroup( name, permissions )
	{
		if( !this.groups.has( name ) ) {
			throw new Error( `Group ${ name } does not exist` );
		}
		
		return this.groups.set( name, permissions );
	}
}

module.exports = new Authorization();
