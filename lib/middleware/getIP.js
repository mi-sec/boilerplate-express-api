/** ****************************************************************************************************
 * File: getIP.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const remoteHeaders = [ 'x-forwarded-for', 'forwarded-for', 'forwarded', 'x-client-ip', 'x-real-ip', 'client-ip', 'real-ip', 'x-forwarded', 'cluster-client-ip', 'remote-addr' ];

function getIPv4( ip ) {
    return ip.split( '.' )
        .reduce( ( addr, d ) => ( addr << 8 ) + Number( d ), 0 ) >>> 0;
}

function isPrivate( sIP ) {
    if( typeof sIP !== 'string' || sIP.length < 7 )
        return false;
    
    if( sIP.startsWith( '::ffff:' ) )
        sIP = sIP.substr( 7 );
    
    let ip = getIPv4( sIP ),
        s;
    
    if( ip === 0xFFFFFFFF )
        return true;
    
    if( ( ip & 0xF0000000 ) >= 0xE0000000 )
        return true;
    
    s = ip >>> 8;
    
    if( s === 0xCB0071 || s === 0xC63364 || s === 0xC05863 || s === 0xC00002 || s === 0xC00000 )
        return true;
    
    s >>>= 8;
    
    if( s === 0xC0A8 || s === 0xA9FE )
        return true;
    
    s >>>= 1;
    
    if( s === 0x6309 )
        return true;
    
    s >>>= 3;
    
    if( s === 0xAC1 )
        return true;
    
    s >>>= 2;
    
    if( s === 0x191 )
        return true;
    
    s >>>= 2;
    
    return s === 127 || s === 10 || !s;
}

function getIP( req ) {
    const
        snip  = a => a,
        check = ra => typeof ra === 'string' && ( m = ra.match( /^.*?(\d+)\.(\d+)\.(\d+)\.(\d+)|::1$/ ) );
    
    let m, rh, avoidPrivate;
    
    for( const addrName of remoteHeaders ) {
        rh = req.headers[ addrName ];
        if( typeof rh !== 'string' || !( m = rh.match( /^.*?(\d+)\.(\d+)\.(\d+)\.(\d+)$/ ) ) )
            continue;
        
        if( isPrivate( m[ 1 ] ) ) {
            if( avoidPrivate )
                continue;
            
            avoidPrivate = rh;
        } else
            return snip( rh );
    }
    
    if( check( req.ip ) )
        if( !isPrivate( m[ 1 ] ) )
            return snip( req.ip );
        if( !avoidPrivate )
            avoidPrivate = req.ip;
    
    rh = req.connection && req.connection.remoteAddress;
    
    if( check( rh ) )
        if( !isPrivate( m[ 1 ] ) )
            return snip( rh );
        if( !avoidPrivate )
            avoidPrivate = rh;
    
    return snip( avoidPrivate );
}

module.exports = getIP;