/** ****************************************************************************************************
 * File: isPrivateIP.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

export function convertToIPv4Array( ip ) {
    return ip.split( '.' ).reduce( ( addr, d ) => ( addr << 8 ) + Number( d ), 0 ) >>> 0;
}

export default function isPrivateIP( sIP ) {
    if( typeof sIP !== 'string' || sIP.length < 7 )
        return false;
    
    if( sIP.startsWith( '::ffff:' ) )
        sIP = sIP.substr( 7 );
    
    let ip = convertToIPv4Array( sIP ),
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