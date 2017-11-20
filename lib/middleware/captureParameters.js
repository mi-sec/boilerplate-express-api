/** ****************************************************************************************************
 * File: captureParameters.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

function prepareParameters( req, res, next ) {
    console.log( res.locals );

    // next();

    // if( item.route.includes( ':' ) ) {
    //     console.log( 'PARAM NEEDED FOR', item );
	//
     //    const path = /([^:]+)([^\/]+)/.exec( item.route ).pop().replace( ':', '' );
     //    console.log( path );
	 //
      //   this.express.param( path, function( req, res, next, value ) {
      //       console.log( 'CALLED ONLY ONCE', value );
      //       next();
      //   } );
    // }
}

module.exports = () => {
    return prepareParameters;
};