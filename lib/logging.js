/** ****************************************************************************************************
 * File: logging.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 30-Oct-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

import { isPrivateIPv4 } from './isPrivateIP';

const
    style      = require( 'ansi-styles' ),
    onFinished = require( 'on-finished' ),
    onHeaders  = require( 'on-headers' ),
    os         = require( 'os' ),
    hostname   = os.hostname();