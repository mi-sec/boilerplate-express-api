/** ****************************************************************************************************
 * File: APIError.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 17-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    Response = require( 'http-response-class' ),
    APIError = {};

APIError.INCORRECT_USERNAME_PASSWORD = new Response( 401, 'Incorrect username or password' );
APIError.USER_NOT_FOUND              = new Response( 404, 'User does not exist' );
APIError.USER_EXISTS                 = new Response( 409, 'User already exists' );
APIError.MISSING_USERNAME_PASSWORD   = new Response( 412, 'Missing username or password' );

module.exports = APIError;