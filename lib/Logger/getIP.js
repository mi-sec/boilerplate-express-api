/** ****************************************************************************************************
 * File: getIP.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    isPrivateIP   = require( './isPrivateIP' ),
    remoteHeaders = [ 'x-forwarded-for', 'forwarded-for', 'forwarded', 'x-client-ip', 'x-real-ip', 'client-ip', 'real-ip', 'x-forwarded', 'cluster-client-ip', 'remote-addr' ];

module.exports = req => {
    let m, rh,
        avoidPrivate,
        snip  = a => a,
        check = ra => typeof ra === 'string' && ( m = ra.match( /^.*?(\d+)\.(\d+)\.(\d+)\.(\d+)|::1$/ ) );
    
    for( const addrName of remoteHeaders ) {
        rh = req.headers[ addrName ];
        if( typeof rh !== 'string' || !( m = rh.match( /^.*?(\d+)\.(\d+)\.(\d+)\.(\d+)$/ ) ) )
            continue;
        else if( isPrivateIP( m[ 1 ] ) )
            if( avoidPrivate )
                continue;
            else
                avoidPrivate = rh;
        else
            return snip( rh );
    }
    
    if( check( req.ip ) ) {
        if( !isPrivateIP( m[ 1 ] ) )
            return snip( req.ip );
        
        if( !avoidPrivate )
            avoidPrivate = req.ip;
    }
    
    rh = req.connection && req.connection.remoteAddress;
    
    if( check( rh ) ) {
        if( !isPrivateIP( m[ 1 ] ) )
            return snip( rh );
        if( !avoidPrivate )
            avoidPrivate = rh;
    }
    
    return snip( avoidPrivate );
};