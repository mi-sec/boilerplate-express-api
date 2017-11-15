/** ****************************************************************************************************
 * File: bytesToSize.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 15-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

module.exports = bytes => {
    if( !bytes )
        return '0 Byte';

    const
        sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB' ],
        i     = parseInt( ~~( Math.log( bytes ) / Math.log( 1024 ) ) );

    return Math.round( bytes / Math.pow( 1024, i ) ) + ' ' + sizes[ i ];
};