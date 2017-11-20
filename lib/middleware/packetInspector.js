/** ****************************************************************************************************
 * File: packetInspector.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 20-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter: off

const
    {
        HEADER_EXCEEDS_LENGTH,
        PAYLOAD_EXCEEDS_LENGTH,
        URI_EXCEEDS_LENGTH
    } = require( '../APIError' );

function inspect( req, res, next ) {
    const p = res.locals;

    // Sanity checks
    if( `${req.protocol}://${req.hostname}${req.path}`.length >= process.config.maximumURISize ) {
        return p.error( URI_EXCEEDS_LENGTH );
    } else if( req.rawHeaders.join( '' ).length >= process.config.maximumHeaderSize ) {
        return p.error( HEADER_EXCEEDS_LENGTH );
    } else if(
        req.headers[ 'content-length' ] >= process.config.maximumPayloadSize ||
        JSON.stringify( p.data ).length >= process.config.maximumPayloadSize
    ) {
        return p.error( PAYLOAD_EXCEEDS_LENGTH );
    }

    next();
}

module.exports = () => {
    return inspect;
};