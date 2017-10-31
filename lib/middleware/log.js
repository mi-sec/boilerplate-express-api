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
    if( !o || !o.headers || !o.headers[ 'content-length' ] )
        return o[ CONTENT_LENGTH ] || 0;
    
    return o.headers[ 'content-length' ];
}

function colored( status ) {
    return status >= 500 ? style.red
        : status >= 400 ? style.yellow
            : status >= 300 ? style.cyan
                : status >= 200 ? style.green
                    : style.white;
}

function log( req, res, next ) {
    function logRequest() {
        const
            timestamp     = new Date().toISOString(),
            statusCode    = res.statusCode,
            httpVersion   = req.httpVersion,
            method        = req.method,
            path          = req.path,
            contentLength = contentLegnth( req );
        
        console.log( Object.keys( req ) );
        
        let line = [
            timestamp,
            '-',
            statusCode,
            `HTTP${httpVersion}`,
            method,
            path,
            '|',
            `${contentLength} bytes`,
            end
        ];
        
        stream.write(
            colored( statusCode ).open +
            line.join( ' ' ) +
            colored( log.statusCode ).close
        );
    }
    
    onFinished( res, logRequest );
    
    next();
}

module.exports = {
    log: s => {
        stream = bufferStream( process.stdout );
        server = s;
        return log;
    }
};