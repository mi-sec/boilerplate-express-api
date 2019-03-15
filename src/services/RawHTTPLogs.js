/** ****************************************************************************************************
 * File: RawHTTPLogs.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Mar-2019
 *******************************************************************************************************/
'use strict';

const LimitedArray = require( '../utils/LimitedArray' );

class RawHTTPLogs extends LimitedArray
{
	bind( server )
	{
		server.on( 'connection',
			socket => socket.on( 'data',
				d => this.push( d.toString( 'ascii' ) )
			)
		);
	}
	
	setMaximumLogs( v )
	{
		super.max = v;
	}
	
	getLogs()
	{
		return this;
	}
	
	stopLogs()
	{
		this.push = () => {};
	}
	
	resumeLogs()
	{
		this.push = super.push;
	}
}

module.exports = RawHTTPLogs;
