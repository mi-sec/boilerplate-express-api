/** ****************************************************************************************************
 * File: authorization.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const guard = require( 'express-jwt-permissions' );

function authorization( req, res, next ) {
    // return res.locals.error( ddosResponse );
    // return 403 if not authed
    
    guard( {
        requestProperty     : 'locals.authcode',
        permissionsProperty : 'permissions'
    } ).check( '' )( req, res, next );
    
    
    
    console.log( 'AUTHORIZATION' );
    console.log( res.locals );
    
    /*
    const
        params  = [ item.route ],
        request = ( req, res ) => {
            let p     = res.locals;
            p.config  = item.route;
            p.service = serviceName;
            
            return item.exec( req, p );
        };
    
    if( item.permissions === AUTH.PERMISSIONS.NONE ) {
        params.push( request );
    } else {
        params.push(
            guard( {
                requestProperty: 'authcode',
                permissionsProperty: 'permissions'
            } )
                .check( item.permissions ),
            request
        );
    }
    
    this.express[ item.method.toLowerCase() ]( ...params );
    */
    
    if( res.locals )
        next();
}

module.exports = () => {
    return authorization;
};