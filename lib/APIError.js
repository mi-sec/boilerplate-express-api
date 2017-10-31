/** ****************************************************************************************************
 * File: APIError.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    HTTPCodes                                = require( './HTTPCodes' ),
    { isObject, has, nonEnumerableProperty } = require( './util' ),
    captureStackTrace                        = Error.prepareStackTrace,
    customErrorPreparation                   = ( error, stackTrace ) => {
        if( typeof captureStackTrace === 'function' ) {
            let bluebird = stackTrace[ 0 ].getFileName();
            if( bluebird && bluebird.indexOf( '/bluebird/' ) !== -1 )
                return captureStackTrace( error, stackTrace );
            
            Error.prepareStackTrace = captureStackTrace;
        }
        
        let cutIndex = 0;
        
        stackTrace.some(
            ( callsite, i ) => {
                let
                    fn = callsite.getFileName(),
                    p  = fn && fn.split( '/' );
                
                if( !p )
                    return true;
                
                p.pop();
                cutIndex = i;
                
                let last = p[ p.length - 1 ],
                    prev = p[ p.length - 2 ];
                
                return !( last === 'api-error' || ( last === 'lib' && prev === 'api-error' ) );
            }
        );
        
        nonEnumerableProperty( error, 'rawStackTrace', stackTrace.slice( cutIndex ) );
        
        const st = systemTrace( error, error.rawStackTrace );
        Error.prepareStackTrace = customErrorPreparation;
        return st;
    };

Error.prepareStackTrace = customErrorPreparation;

function systemTrace( error, stackTrace ) {
    return `${error.name}: ${error.message}\n${stackTrace.map( cs => {
        let typeName = cs.getTypeName(),
            funcName = cs.getFunctionName() || '<anonymous>',
            fileName = cs.getFileName(),
            ln       = cs.getLineNumber(),
            cn       = cs.getColumnNumber(),
            codeName = typeName ? `${typeName}.${funcName}`: funcName;
        return `    at ${codeName} (${fileName}:${ln}:${cn})\n`;
    } ).join( '' )}`;
}

class APIError extends Error
{
    /**
     * @param {string|Error} message
     * @param {?(string|number)} [extra]
     * @param {number} [statusCode=500]
     */
    constructor( message, extra = null, statusCode = 500 )
    {
        if( isObject( message ) && has( message, 'message', 'statusCode' ) ) {
            extra = message.reason;
            statusCode = message.statusCode;
            message = message.message;
        }
        
        super( message );
        
        if( message instanceof Error ) {
            if( !message.statusCode ) {
                this.init( message.message, extra, 500, message.stack );
            } else {
                statusCode = statusCode !== 500 ? statusCode: ( message.statusCode || 500 );
                this.init( message.message, ( extra || '' ) + ( message.reason || '' ), statusCode, message.stack );
            }
            
            return;
        }
        
        if( typeof extra === 'number' && statusCode === 500 ) {
            statusCode = extra;
            extra = null;
        }
        
        this.init( message, extra, statusCode );
    }
    
    /**
     * @param {string} message
     * @param {string} extra
     * @param {number} [statusCode=500]
     * @private
     */
    init( message, extra, statusCode = 500 ) {
        this.name = 'APIError';
        this.message = message || 'Unspecified error';
        this.statusCode = statusCode;
        nonEnumerableProperty( this, 'showTrace', APIError.TRACE );
        nonEnumerableProperty( this, 'reason', extra || '' );
    }
    
    /**
     * @return {string}
     */
    toString() {
        return super.toString() + ( this.reason ? `, reason: ${this.reason}`: '' );
    }
    
    /**
     * Used to signal error processing code that the stack trace should shown or included when sent to a client.
     *
     * @return {APIError}
     */
    trace() {
        this.showTrace = true;
        return this;
    }
    
    /**
     * This simply adds a explanation of an error by putting this string into the `reason` field.
     *
     * @param {string} info
     * @return {APIError}
     */
    add( info ) {
        this.reason = info;
        return this;
    }
    
    /**
     * @param {string|number} code
     * @return {object}
     */
    static code( code ) {
        return HTTPCodes[ code ];
    }
    
    /**
     *
     * @param {APIError|Error} err
     * @param {boolean} stack
     */
    static stringify( err, stack = false ) {
        let s = err.message;
        if( err.reason ) s += ', Reason: ' + err.reason;
        if( err.originalMessage ) s += ( err.reason ? ', ': ' ' ) + 'Original: ' + err.originalMessage;
        if( stack )
            s += '\n    ' + err.stack.split( /[\r\n]+/ ).join( '\n    ' ) + '\n';
        return s;
    }
    
    static fail( code, reason = null, originalMessage = null, strip = 1 ) {
        let e = typeof code === 'object' ? code: HTTPCodes[ code ];
        
        if( reason instanceof Error && !originalMessage )
            originalMessage = reason.message;
        
        if( !e ) {
            console.error( `bad fail in fail => code:`, JSON.stringify( code, null, 4 ) );
            e = {
                message: 'BAD ERROR: ' + ( typeof code === 'string' ? code: JSON.stringify( code, null, 4 ) ),
                reason: 'Missing error code',
                errorCode: 42
            };
            if( originalMessage ) e.originalMessage = originalMessage;
            return APIError.typefail( Error, e, reason, strip + 1 );
        }
        
        if( !reason && e.reason )
            reason = e.reason;
        
        if( originalMessage )
            e.originalMessage = originalMessage;
        
        return APIError.typefail( e.errorCategory, code, reason, strip + 1 );
    }
    
    /**
     * @param {string|Error} errorType
     * @param {number|string|object} code
     * @param {?string} [reason]
     * @param {number} [strip]
     * @return {Error}
     */
    static typefail( errorType, code, reason = null, strip = 1 ) {
        let e          = typeof code === 'object' ? code : HTTPCodes[ code ],
            Constr     = typeof errorType === 'string' ? ce[ errorType ]: errorType,
            err        = new Constr( e.message, reason || e.statusCode || 500, reason ? ( e.statusCode || 500 ): undefined ),
            stackTrace = err.stack.split( /[\r\n]+/ );
        
        err.reason = reason || e.reason || 'No further explanation available.';
        
        if( e.originalMessage )
            err.originalMessage = e.originalMessage;
        
        err.errorCode = e.errorCode;
        
        if( e.deprecated )
            err.deprecated = true;
        
        err.stack = stackTrace[ 0 ] + '\n' + stackTrace.slice( strip ).join( '\n' );
        
        return err;
    }
}

/**
 * The value of this static field gets copied to the `showTrace` flag when new errors are created and serves
 * as a default. This flag can also be set manually using the [trace()](@link APIError#trace) function.
 *
 * @type {boolean}
 */
APIError.TRACE = true;

APIError.REQUIRE_RESPONSE_CLASS = {
    message: '',
    statusCode: 42,
    reason: 'Developer - please implement http-response-class for all your responses'
};

APIError.REQUIRE_RESPONSE_CLASS = {
    message: 'Argument Error - All responses must be instanceof Response',
    statusCode: 510,
    reason: 'Developer - please implement http-response-class for all your responses'
};

module.exports = APIError;