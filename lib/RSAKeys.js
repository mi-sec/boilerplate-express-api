/** ****************************************************************************************************
 * File: RSAKeys.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 18-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	crypto = require( 'crypto' );

class RSAKeys
{
	constructor()
	{
		this.generateECDHEKeyPair();
	}
	
	generateECDHEKeyPair()
	{
		const ECDHE = crypto.createDiffieHellman( 1024 );
		ECDHE.generateKeys();
		this.publicKey  = ECDHE.getPublicKey();
		this.privateKey = ECDHE.getPrivateKey();
		console.log( this.publicKey.toString( 'utf8' ) );
	}
}

module.exports = new RSAKeys();
