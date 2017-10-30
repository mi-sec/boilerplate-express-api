/** ****************************************************************************************************
 * File: util.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-OCT-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    querystring                = require( 'querystring' ),
    ERROR                      = 'Error',
    FUNCTION_ERROR             = `${ERROR} - Function failed.`,
    ARGUMENT_ERROR             = 'Argument Error',
    ARGUMENT_ERROR_PROPERTY    = p => `${ARGUMENT_ERROR} - Item expected to have property: ${p}`,
    ARGUMENT_ERROR_BOOLEAN     = `${ARGUMENT_ERROR} - Item expected to be typeof Boolean`,
    ARGUMENT_ERROR_STRING      = `${ARGUMENT_ERROR} - Item expected to be typeof String`,
    ARGUMENT_ERROR_NUMBER      = `${ARGUMENT_ERROR} - Item expected to be typeof Number`,
    ARGUMENT_ERROR_ARRAY       = `${ARGUMENT_ERROR} - Item expected to be typeof Array`,
    ARGUMENT_ERROR_OBJECT      = `${ARGUMENT_ERROR} - Item expected to be typeof Object`,
    ARGUMENT_ERROR_POWER       = `${ARGUMENT_ERROR} - Item expected to be power of two`,
    ARGUMENT_ERROR_HTTP        = `${ARGUMENT_ERROR} - Method expected to be valid HTTP method`,
    ARGUMENT_ERROR_EMAIL       = `${ARGUMENT_ERROR} - Item expected to be valid email`,
    ARGUMENT_ERROR_IPV4        = `${ARGUMENT_ERROR} - Item expected to be valid IPv4`,
    ARGUMENT_ERROR_DOMAIN_NAME = `${ARGUMENT_ERROR} - Item expected to be valid domain name`,
    LARGE_ARRAY_SIZE           = 200,
    { isArray: array }         = Array;

function _isNotNaN( n ) {
    return ( n === n );
}

function isNaN( ...n ) {
    return !n.filter( _isNotNaN ).length;
}

function _isNotUndefined( n ) {
    return !( typeof n === 'undefined' && _isNotNaN( n ) );
}

function isUndefined( ...n ) {
    return !n.filter( _isNotUndefined ).length;
}

function _isNotNull( n ) {
    return ( n && _isNotNaN( n ) && _isNotUndefined( n ) );
}

function isNull( ...n ) {
    return !n.filter( _isNotNull ).length;
}

function _isNotBoolean( n ) {
    return typeof n !== 'boolean';
}

function isBoolean( ...n ) {
    return !n.filter( _isNotBoolean ).length;
}

function _isNotString( n ) {
    return typeof n !== 'string';
}

function isString( ...n ) {
    return !n.filter( _isNotString ).length;
}

function _isNotNumber( n ) {
    return ( +n !== n );
}

function isNumber( ...n ) {
    return !n.filter( _isNotNumber ).length;
}

function _isNotArray( n ) {
    return !Array.isArray( n );
}

function isArray( ...n ) {
    return !n.filter( _isNotArray ).length;
}

function _isNotObject( n ) {
    return !( _isNotArray( n ) && typeof n === 'object' );
}

function isObject( ...n ) {
    return !n.filter( _isNotObject ).length;
}

function _isNotBuffer( n ) {
    return !( Buffer.isBuffer( n ) );
}

function isBuffer( ...n ) {
    return !n.filter( _isNotBuffer ).length;
}

function _isNotFunction( n ) {
    return typeof n !== 'function';
}

function isFunction( ...n ) {
    return !n.filter( _isNotFunction ).length;
}

function isPowerOfTwo( n ) {
    return !( n & ( n - 1 ) );
}

function keys( o ) {
    return isObject( o ) ? Object.keys( o ) : o;
}

function values( o ) {
    return isObject( o ) ? Object.values( o ) : o;
}

function publicObject( o ) {
    return keys( o ).reduce(
        ( r, i ) => ( r[ i ] = o[ i ], r ),
        {}
    );
}

function has( o, ...args ) {
    if( isString( o ) )
        return args.filter( i => o.indexOf( i ) !== -1 ).length === args.length;
    else if( isArray( o ) )
        return args.filter( i => o.includes( i ) ).length === args.length;
    else if( isObject( o ) )
        return args.filter( i => o.hasOwnProperty( i ) ).length === args.length;
    else
        return false;
}

function hasSome( o, ...args ) {
    if( isString( o ) )
        return !!( args.filter( i => o.indexOf( i ) !== -1 ).length );
    else if( isArray( o ) )
        return !!( args.filter( i => o.includes( i ) ).length );
    else if( isObject( o ) )
        return !!( args.filter( i => o.hasOwnProperty( i ) ).length );
    else
        return false;
}

function sortObject( o ) {
    if( !isObject( o ) )
        throw new Error( ARGUMENT_ERROR_OBJECT );
    
    const
        sorted = {},
        a      = [];
    
    for( const key in o )
        if( o.hasOwnProperty( key ) )
            a.push( key );
    
    a.sort();
    
    for( let i = 0; i < a.length; i++ )
        sorted[ a[ i ] ] = o[ a[ i ] ];
    
    return sorted;
}

function sort( obj ) {
    if( isArray( obj ) )
        return obj.sort();
    else if( isObject( obj ) )
        return sortObject( obj );
    else
        throw new Error( ARGUMENT_ERROR_ARRAY );
}

function stringify( n ) {
    if( isObject( n ) )
        return JSON.stringify( n );
    else
        throw new Error( ARGUMENT_ERROR_OBJECT );
}

function parse( n ) {
    if( isString( n ) )
        return JSON.parse( n );
    else
        throw new Error( ARGUMENT_ERROR_STRING );
}

function map( o, fn ) {
    if( isArray( o ) && isFunction( fn ) )
        return o.map( fn );
    else if( isObject( o ) && isFunction( fn ) )
        return keys( o ).map( i => fn( i, o[ i ] ) );
    else
        return ARGUMENT_ERROR_ARRAY;
}

function startsWith( str, char ) {
    return isString( str ) && str.startsWith( char );
}

function isValidJSON( str ) {
    if( !isString( str ) || isUndefined( str ) || isNull( str ) )
        return false;
    
    return /^[\],:{}\s]*$/.test(
        str
            .replace( /\\["\\\/bfnrtu]/g, '@' )
            .replace( /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']' )
            .replace( /(?:^|:|,)(?:\s*\[)+/g, '' )
    );
}

function isValidHTTPMethod( n ) {
    return (
        isString( n ) &&
        /^(GET|POST|PUT|PATCH|DELETE|COPY|HEAD|OPTIONS|CONNECT)$/.test( n.toUpperCase() )
    );
}

function isValidWebDAVMethod( n ) {
    return (
        isString( n ) &&
        (
            isValidHTTPMethod( n ) ||
            /^(LINK|UNLINK|PURGE|LOCK|UNLOCK|PROPFIND|VIEW)$/.test( n.toUpperCase() )
        )
    );
}

function isProtocol( n ) {
    return (
        isString( n ) &&
        /s?m?h?f?t?tps?|wss|file/i.test( n.toLowerCase() )
    );
}

function isValidEmail( n ) {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test( n );
}

function isValidIPv4( n ) {
    return /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/.test( n );
}

function isValidDomainName( n ) {
    return (
        n === 'localhost' ||
        /^(?:(?:(?:[a-zA-Z0-9\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9-\.]){1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/i.test( n )
    );
}

function isPath( n ) {
    return /(\\|\/)([a-z0-9\s_@\-^!#$%&+={}\[\]]+)(\\|\/)/i.test( n );
}

function isValidQueryString( qs ) {
    let t = querystring.parse( qs );
    t = keys( t ).filter( i => !!( t[ i ] ) );
    return isString( qs ) && t.length;
}

function buildQueryString( qs ) {
    if( !isObject( qs ) )
        throw new Error( ARGUMENT_ERROR_OBJECT );
    
    function deepCheck( o ) {
        map( o, ( k, v ) => {
            if( isObject( v ) )
                o[ k ] = querystring.stringify( v, ',', ':' );
        } );
        
        return o;
    }
    
    qs = deepCheck( qs );
    qs = querystring.stringify( qs );
    
    console.log( qs );
    
    if( isValidQueryString( qs ) )
        return `?${qs}`;
    else
        throw new Error( FUNCTION_ERROR );
}

function empty( o ) {
    return !o || ( array( o ) ? !o.length : !Object.keys( o ).length );
}

function uniq( arr, fn )
{
    let index = -1;
    if( !array( arr ) )
        throw new Error( ARGUMENT_ERROR_ARRAY );
    
    const
        length = arr.length,
        result = [];
    
    if( length >= LARGE_ARRAY_SIZE )
        return [ ...new Set( arr ) ];
    
    while ( ++index < length ) {
        const
            value = arr[ index ];
        
        let seenIndex = result.length,
            seen      = false;
        
        if( fn )
            while ( seenIndex-- )
                if( fn( result[ seenIndex ], value ) )
                    seen = true;
                else
                    while ( seenIndex-- )
                        if( result[ seenIndex ] === value )
                            seen = true;
        
        if( !seen )
            result[ result.length ] = value;
    }
    
    return result;
}

function flatten( arr, result = [] )
{
    const
        length = arr && arr.length;
    
    if( !length )
        return result;
    
    let index = -1;
    
    while ( ++index < length ) {
        let value = arr[ index ];
        if( array( value ) )
            flatten( value, result );
        else
            result[ result.length ] = value;
    }
    return result;
}

function extractIP( inets ) {
    return flatten(
        values( inets )
    )
        .filter( a => !a.internal && a.family !== 'IPv6' )
        .map( a => a.address )[ 0 ];
}

function defineProperty( o, name, g, s = null ) {
    let prop;
    if ( !s && isObject( g ) )
        return Object.defineProperty( o, name, g );
    else
        prop = {
            enumerable: false,
            set: s || undefined,
            get: g || undefined
        };
    
    if ( o.hasOwnProperty( name ) )
        throw new Error( `Property "${name}" already exists on object: ` + JSON.stringify( Object.getOwnPropertyDescriptor( o, name ) ) );
    
    Object.defineProperty( o, name, prop );
    return o;
}

function nonEnumerableProperty( o, name, val ) {
    if( isNull( o, name ) || isBoolean( o ) || isString( o ) || isNumber( o ) )
        return;
    
    const prop = {
        configurable: true,
        writable: true,
        enumerable: false
    };
    
    if( typeof val !== 'undefined' )
        prop.value = val;
    
    Object.defineProperty( o, name, prop );
}

module.exports = {
    ERROR,
    FUNCTION_ERROR,
    ARGUMENT_ERROR,
    ARGUMENT_ERROR_PROPERTY,
    ARGUMENT_ERROR_BOOLEAN,
    ARGUMENT_ERROR_STRING,
    ARGUMENT_ERROR_NUMBER,
    ARGUMENT_ERROR_ARRAY,
    ARGUMENT_ERROR_OBJECT,
    ARGUMENT_ERROR_POWER,
    ARGUMENT_ERROR_HTTP,
    ARGUMENT_ERROR_EMAIL,
    ARGUMENT_ERROR_IPV4,
    ARGUMENT_ERROR_DOMAIN_NAME,
    LARGE_ARRAY_SIZE,
    array,
    isNull,
    isUndefined,
    isNaN,
    isBoolean,
    isString,
    isNumber,
    isArray,
    isObject,
    isBuffer,
    isFunction,
    isPowerOfTwo,
    keys,
    values,
    publicObject,
    has,
    hasSome,
    sortObject,
    sort,
    isValidJSON,
    stringify,
    parse,
    map,
    startsWith,
    isValidHTTPMethod,
    isValidWebDAVMethod,
    isProtocol,
    isValidEmail,
    isValidIPv4,
    isPath,
    isValidDomainName,
    isValidQueryString,
    buildQueryString,
    querystring,
    empty,
    uniq,
    flatten,
    extractIP,
    defineProperty,
    nonEnumerableProperty
};