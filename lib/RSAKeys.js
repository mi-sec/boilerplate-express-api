/** ****************************************************************************************************
 * File: RSAKeys.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 18-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	{ pki } = require( 'node-forge' ),
	debug   = require( './debug' );

class RSAKeys
{
	constructor()
	{
		this.publicKey  = '';
		this.privateKey = '';
	}

	generateKeyPair()
	{
		debug( 'Generating RSA SHA256 2048-Bit KeyPair' );

		return new Promise(
			( res, rej ) => pki.rsa.generateKeyPair( { bits: 2048, e: 0x10001, workers: -1 },
				( e, d ) => {
					if( e ) {
						rej( e );
					} else {
						d.keypair    = { ...d };
						d.publicKey  = pki.publicKeyToPem( d.publicKey );
						d.privateKey = pki.privateKeyToPem( d.privateKey );
						res( d );
					}
				}
			)
		);
	}

	async generateRSAKeyPair()
	{
		const keyPair = await this.generateKeyPair();
		console.log( keyPair );
		this.keyPair    = keyPair;
		this.publicKey  = keyPair.publicKey;
		this.privateKey = keyPair.privateKey;
	}
}

module.exports = new RSAKeys();
