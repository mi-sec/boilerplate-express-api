/** ****************************************************************************************************
 * File: onStop.js
 * Project: melior
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 26-Mar-2019
 *******************************************************************************************************/
'use strict';

const
	MongoDB = require( '../services/database/MongoDB' );

module.exports = async () => {
	await MongoDB.connection.close();
};
