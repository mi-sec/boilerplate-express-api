/** ****************************************************************************************************
 * File: spam.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response        = require( 'http-response-class' ),
    {
        amnestyFrequency,
        strikes
    }               = require( '../../config' ).spamming,
    jail            = {},
    prison          = {};

function clearForParole() {
    const
        now = Date.now();
    
    Object.keys( jail )
        .map(
            key => {
                jail[ key ] = jail[ key ].filter(
                    i => i.timestamp > now || prison.hasOwnProperty( key )
                );
            }
        );
}

function sentenceToPrison( IP, infraction ) {
    const
        now       = Date.now(),
        violation = {
            infraction,
            timestamp: now
        };
    
    if( prison.hasOwnProperty( IP ) )
        prison[ IP ].offenses.push( violation );
    else
        prison[ IP ] = {
            offenses: [ violation ],
            originalOffense: now
        };
    
    // Move them from jail to prison, clear the jails. Let them do it again...
    jail[ IP ].length = 0;
}

function isImprisoned( ip ) {
    if( prison.hasOwnProperty( ip ) )
        if( prison[ ip ].offenses.length >= strikes )
            return true;
    return false;
}

function pulse( req, res, next ) {
    // I don't mean to confuse, but this function has to be as
    // optimized as possible. Sending a force unencapsulation is
    // more optimized in the form of array declaration.
    const
        [
            { now },
            { IP }
        ]       = [
            Date,
            res.locals
        ],
        offense = {
            timestamp: now()
        };
    
    if( isImprisoned( IP ) )
        return res.locals.error(
            new Response(
                503,
                'You have been flagged as a hacker and must contact an administrator.',
                'Spam Filter'
            )
        );
    
    if( jail.hasOwnProperty( IP ) )
        jail[ IP ].push( offense );
    else
        jail[ IP ] = [ offense ];
    
    if( jail[ IP ].length >= 10 )
        sentenceToPrison( IP );
    else if( jail[ IP ].length >= 5 )
        res.locals.error( new Response( 418, 'Spamming attempt caught', 'Spam Filter' ) );
    
    if( res.locals )
        next();
}

setInterval(
    clearForParole,
    amnestyFrequency
);

module.exports = () => {
    return pulse;
};