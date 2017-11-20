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

APIError.BAD_PERMISSION_SET           = new Response( 400, 'Permissions are malformed' );
APIError.INCORRECT_USERNAME_PASSWORD  = new Response( 401, 'Incorrect username or password' );
APIError.TOKEN_EXPIRED                = new Response( 401, 'Provided token has expired' );
APIError.TOKEN_ERROR                  = new Response( 401, 'There is an error with the Authorization code' );
APIError.NOT_AUTHENTICATED            = new Response( 401, 'User is not authenticated' );
APIError.UNKNOWN_API_KEY              = new Response( 401, 'Unknown API Key' );
APIError.NOT_AUTHORIZED               = new Response( 403, 'User is not authorized to use this resource' );
APIError.FORBIDDEN                    = new Response( 403, 'User is forbidden to use this resource' );
APIError.USER_NOT_FOUND               = new Response( 404, 'User does not exist' );
APIError.METHOD_NOT_ALLOWED           = new Response( 405 );
APIError.USER_EXISTS                  = new Response( 409, 'User already exists' );
APIError.MISSING_USERNAME_PASSWORD    = new Response( 412, 'Missing username or password' );
APIError.HEADER_EXCEEDS_LENGTH        = new Response( 413, 'Headers exceeds maximum length' );
APIError.PAYLOAD_EXCEEDS_LENGTH       = new Response( 413, 'Payload exceeds maximum length' );
APIError.URI_EXCEEDS_LENGTH           = new Response( 414, 'URI exceeds maximum length' );
APIError.INTERNAL_AUTHORIZATION_ERROR = new Response( 500, 'Internal Authorization Error' );

module.exports = APIError;