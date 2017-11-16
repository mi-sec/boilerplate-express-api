/** ****************************************************************************************************
 * File: authorization.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 16-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

function authorization( req, res, next ) {
    // return res.locals.error( ddosResponse );
    // return 403 if not authed
    
    
    
    if( res.locals )
        next();
}

module.exports = () => {
    return authorization;
};