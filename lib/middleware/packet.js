/** ****************************************************************************************************
 * @file: packet.js
 * @project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 13-Aug-2018
 *******************************************************************************************************/
'use strict';

const
	gonfig      = require( 'gonfig' ),
	{
		timeout,
		dotfiles
	}           = gonfig.get( 'server' ),
	Response    = require( 'http-response-class' ),
	UUIDv4      = require( 'uuid/v4' ),
	onFinished  = require( 'on-finished' ),
	{ resolve } = require( 'path' ),
	{ lstat }   = require( 'fs' ).promises;

function inspection( req, res, next ) {
	const id = UUIDv4();

	let packet = {
		id,
		path: req.path,
		method: req.method,
		params: req.params,
		query: req.query,
		cookies: req.cookies,
		data: req.body || req.data,
		headers: {
			'Access-Control-Expose-Headers': '*',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Max-Age': 1728000,
			'Content-Type': 'application/json; charset=utf-8',
			RequestID: id
		},
		ContentLength: req.headers[ 'content-length' ],
		IP: req.ip
	};

	packet.internalTime = 0;
	packet.startTimer   = process.hrtime();
	packet.endTimer     = () => {
		const
			hrtime = process.hrtime( packet.startTimer ),
			t      = ( ( hrtime[ 0 ] * 1e9 ) + hrtime[ 1 ] ).toFixed( 2 );

		packet.internalTime = t < 1000 ? `${ t } ns` :
			t < 1000000 ? `${ ( t / 1e3 ) } μs` :
				t < 1000000000 ? `${ ( t / 1e6 ) } ms` :
					`${ ( t / 1e9 ) } s`;
	};

	const packetTimeout = setTimeout(
		() => !( res && packet ) || packet.respond( new Response( 408, 'Request Timeout' ) ),
		timeout
	);

	packet.clearTimeout = () => clearTimeout( packetTimeout );

	packet.respond = d => {
		if( !res || !packet ) {
			return;
		}

		packet.endTimer();

		if( d instanceof Response ) {
			const data = JSON.stringify( d.data || '' );

			res
				.set( packet.headers )
				.status( d.statusCode )
				.send( data )
				.end();
		} else {
			return packet.respond( new Response( 400, d ) );
		}

		packet.kill();
	};

	packet.sendFile = async ( fpath, opts ) => {
		packet.kill();
		fpath = resolve( fpath );

		const { size }     = await lstat( fpath );
		res._contentLength = size;

		res.sendFile( fpath, {
			dotfiles,
			headers: { 'x-timestamp': Date.now(), 'x-sent': true },
			...opts
		} );
	};

	packet.kill = () => {
		if( !res ) {
			return;
		}

		packet.clearTimeout();

		res.locals = packet = null;
	};

	res.locals = packet;

	onFinished( res, ( e, d ) => {
		if( gonfig.log === gonfig.LEVEL.VERBOSE ) {
			console.log( {
				timestamp: new Date().toISOString(),
				request: `HTTP/${ req.httpVersion } ${ req.method } ${ req.path }`,
				response: `${ d.statusCode } ${ d.statusMessage }`,
				in: +req.headers[ 'content-length' ] || 0,
				out: +d._contentLength || 0,
				time: packet.internalTime
			} );
		}

		!packet || packet.kill();
		res = null;
	} );

	next();
}

module.exports = () => {
	return inspection;
};
