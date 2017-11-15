/** ****************************************************************************************************
 * File: spam.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 01-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response     = require( 'http-response-class' ),
    { spamming } = require( '../../config' ),
    jail         = {},
    prison       = {};

function clearForParole() {
    const
        now = Date.now();
    
    Object.keys( jail )
        .map(
            key => {
                jail[ key ] = jail[ key ].filter(
                    i => i.timestamp >= now - spamming.allowReleaseFromJailAfter
                );
            }
        );
}

function releaseFromPrision() {
    const
        now = Date.now();
    
    Object.keys( prison )
        .map(
            key => {
                prison[ key ].offenses = prison[ key ].offenses.filter(
                    i => i.timestamp >= now - spamming.allowReleaseFromPrisonAfter
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
    
    if( prison.hasOwnProperty( IP ) ) {
        const
            cooldownLifted = prison[ IP ].offenses.filter(
                i => i.timestamp >= now - spamming.sentencingCooldown
            ).length;
        
        if( !cooldownLifted )
            prison[ IP ].offenses.push( violation );
    } else
        prison[ IP ] = {
            offenses: [ violation ],
            originalOffense: now
        };
}

function isImprisoned( IP ) {
    if( prison.hasOwnProperty( IP ) )
        return prison[ IP ].offenses.length >= spamming.imprisonAfter;
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
                'You have been flagged as a spammer and must contact an administrator.',
                'Spam Filter'
            )
        );
    
    if( jail.hasOwnProperty( IP ) )
        jail[ IP ].push( offense );
    else
        jail[ IP ] = [ offense ];
    
    if( jail[ IP ].length >= spamming.ddosDefense.limit ) {
        sentenceToPrison( IP, spamming.ddosDefense.infraction );
        
        return res.locals.error(
            new Response(
                spamming.ddosDefense.errorCode,
                spamming.ddosDefense.message,
                spamming.origin
            )
        );
    } else if( jail[ IP ].length >= spamming.spammingDefense.limit ) {
        sentenceToPrison( IP, spamming.spammingDefense.infraction );
        
        res.locals.header[ 'Retry-After' ] = spamming.spammingDefense.RetryAfter;
        
        return res.locals.error(
            new Response(
                spamming.spammingDefense.errorCode,
                spamming.spammingDefense.message,
                spamming.origin
            )
        );
    }
    
    if( res.locals )
        next();
}

setInterval(
    clearForParole,
    spamming.clearJailsFrequency
);

setInterval(
    releaseFromPrision,
    spamming.clearPrisonsFrequency
);

module.exports = () => {
    return pulse;
};