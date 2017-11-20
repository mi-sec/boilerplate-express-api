/** ****************************************************************************************************
 * File: spamming.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

module.exports = {
    origin: 'Spam Filter',
    clearJailsFrequency: 500,
    allowReleaseFromJailAfter: 2000,
    clearPrisonsFrequency: 10000,
    allowReleaseFromPrisonAfter: 50000,
    imprisonAfter: 3,
    sentencingCooldown: 5000,
    ddosDefense: {
        limit: 20,
        infraction: 'DDoS Attempt',
        errorCode: 503,
        message: 'You have been flagged as a spammer and must contact an administrator.'
    },
    spammingDefense: {
        limit: 10,
        RetryAfter: 2000,
        infraction: 'Spamming Infraction',
        errorCode: 429,
        message: 'Spamming attempt caught'
    }
};