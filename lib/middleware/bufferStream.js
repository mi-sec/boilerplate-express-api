/** ****************************************************************************************************
 * File: bufferStream.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

function bufferStream( stream, interval ) {
    interval = interval || bufferStream.DEFAULT_BUFFER_DURATION;
    stream   = stream || process.stdout;
    
    const buf = [];
    let timer = null;
    
    function flush() {
        timer = null;
        stream.write( buf.join( '' ) );
        buf.length = 0;
    }
    
    function write( str ) {
        if( timer === null )
            timer = setTimeout( flush, interval );
        buf.push( str );
    }
    
    return { write };
}

bufferStream.DEFAULT_BUFFER_DURATION = 1000;

module.exports = bufferStream;