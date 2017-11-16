/** ****************************************************************************************************
 * File: log.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 31-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    style          = require( 'ansi-styles' ),
    onFinished     = require( 'on-finished' ),
    bufferStream   = require( './bufferStream' ),
    CONTENT_LENGTH = Symbol( 'hidden_content_length' ),
    end            = '\n';

let
    server,
    stream;

function contentLegnth( o ) {
    if( !o || !o.header || !o.header[ 'content-length' ] || !o.header[ 'Content-Length' ] )
        return o[ CONTENT_LENGTH ] || 0;
    
    return o.header[ 'content-length' ] || o.header[ 'Content-Length' ];
}

function colored( status ) {
    return status >= 500 ? style.red
        : status >= 400 ? style.yellow
            : status >= 300 ? style.cyan
                : status >= 200 ? style.green
                    : style.white;
}

/**
 * write - Write a message to the initialized buffer stream
 * @param msg - Log message
 * @param code - HTTP Status Code
 */
function write( msg, code = 200 ) {
    if( !server || !stream ) {
        msg = 'Error - Logger not initialized.';
        code = 500;
        console.log( colored( code ).open + msg + colored( code ).close + end );
    }
    
    stream.write(
        colored( code ).open +
        msg +
        colored( code ).close +
        end
    );
}

function middleware( req, res, next ) {
    function logRequest() {
        const
            line = [
                new Date().toISOString(), '|',
                'HTTP', req.httpVersion, req.method, req.path, '|',
                res.statusCode, res.statusMessage
            ];
        
        write( line.join( ' ' ), res.statusCode );
    }
    
    onFinished( res, logRequest );
    
    next();
}

module.exports = {
    initialize: s => {
        stream = bufferStream( process.stdout );
        server = s;
    },
    middleware: () => {
        return middleware;
    },
    write,
    log: msg => write( msg, 200 ),
    info: msg => write( msg, 300 ),
    error: msg => write( msg, 400 ),
    fatal: msg => write( msg, 500 ),
    immediate: {
        log: msg => console.log( colored( 200 ).open + msg + colored( 200 ).close ),
        info: msg => console.log( colored( 300 ).open + msg + colored( 300 ).close ),
        error: msg => console.log( colored( 400 ).open + msg + colored( 400 ).close ),
        fatal: msg => console.log( colored( 500 ).open + msg + colored( 500 ).close ),
    }
};