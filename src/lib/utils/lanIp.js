/** ****************************************************************************************************
 * @file: lanIp.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	os     = require( 'os' ),
	ifaces = os.networkInterfaces();

/**
 * lanIp
 * @description
 * extract local IPs from the network interfaces
 * @type {Array}
 * @mixin lanIp
 */
module.exports = Object.keys( ifaces ).reduce(
	( r, ifname ) => {
		let alias = 0;

		ifaces[ ifname ].forEach(
			iface => {
				if( iface.family !== 'IPv4' || iface.internal !== false ) {
					return;
				} else if( alias >= 1 ) {
					r.push( ifname + ':' + alias, iface.address );
				} else {
					r.push( iface.address );
				}

				++alias;
			}
		);

		return r;
	}, []
);
