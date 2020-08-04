/** ****************************************************************************************************
 * File: LimitedArray.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Mar-2019
 *******************************************************************************************************/
'use strict';

class LimitedArray extends Array
{
	constructor( length )
	{
		super();
		this.max = length;
	}

	push( val )
	{
		if ( this.length >= this.max ) {
			this.splice( 0, this.length - this.max + 1 );
		}

		return super.push( val );
	}
}

module.exports = LimitedArray;
