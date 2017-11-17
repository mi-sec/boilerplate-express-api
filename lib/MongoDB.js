/** ****************************************************************************************************
 * File: MongoDB.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    {
        MongoClient,
        ObjectId
    }        = require( 'mongodb' ),
    Response = require( 'http-response-class' ),
    config   = require( '../config' );

class MongoDB
{
    constructor( databaseName = 'default', collectionName = 'default' )
    {
        const mongodb       = config.mongodb;
        this.url            = `${mongodb.protocol}${mongodb.host}:${mongodb.port}/${databaseName}`;
        this.databaseName   = databaseName;
        this.collectionName = collectionName;
        this.rObjectId      = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;
    }
    
    async initialize()
    {
        const
            DB = await MongoClient.connect( this.url );
        
        this.db         = DB;
        this.collection = DB.collection( this.collectionName );
        
        return this;
    }
    
    insertPilotObject( AUD, ISS )
    {
        return new Promise(
            ( res, rej ) => {
                const timestamp = new Date();
                this.delete( { master: AUD } )
                    .then(
                        () => this.post( {
                            master: AUD,
                            AUD,
                            ISS,
                            ACL: 'ALL',
                            timestamp
                        } )
                    )
                    .then(
                        r => res( {
                            authcode: r.data.pop()._id,
                            timestamp
                        } )
                    )
                    .catch( rej );
            }
        );
    }
    
    isObjectId( _id )
    {
        return this.rObjectId.test( _id );
    }
    
    toObjectId( _id )
    {
        if( _id instanceof ObjectId )
            return _id;
        else if( this.isObjectId( _id ) )
            return ObjectId( _id );
        else
            return ObjectId();
    }
    
    isAcceptableObject( obj )
    {
        return typeof obj === 'object' && !Array.isArray( obj );
    }
    
    toArray( arr )
    {
        if( Array.isArray( arr ) ) {
            return arr;
        } else {
            return [ arr ];
        }
    }
    
    all()
    {
        return new Promise(
            ( res, rej ) => {
                this.collection.find( { _id: { $not: { $eq: 1 } } } )
                    .toArray()
                    .then( r => r.length ? new Response( 200, r ) : MongoDB.NoContent )
                    .then( res )
                    .catch( rej );
            }
        );
    }
    
    getId( _id )
    {
        return new Promise(
            ( res, rej ) => {
                _id = _id || this.toObjectId( _id );
                
                if( !this.isAcceptableObject( _id ) )
                    _id = { _id };
                
                this.collection.find( _id )
                    .toArray()
                    .then( r => r.length ? new Response( 200, r ) : MongoDB.NotFound )
                    .then( res )
                    .catch( rej );
            }
        );
    }
    
    get( obj )
    {
        return new Promise(
            ( res, rej ) => {
                if( this.isAcceptableObject( obj ) || this.isObjectId( obj ) ) {
                    this.collection.find( obj )
                        .toArray()
                        .then( r => r.length ? new Response( 200, r ) : MongoDB.NoContent )
                        .then( res )
                        .catch( rej );
                } else {
                    res( MongoDB.PreconditionFailed );
                }
            }
        );
    }
    
    post( data )
    {
        return new Promise(
            ( res, rej ) => {
                if( Array.isArray( data ) ) {
                    this.collection.insertMany( data )
                        .then( r => r.ops.length ? new Response( 201, r.ops ) : MongoDB.BadRequest )
                        .then( res )
                        .catch( rej );
                } else {
                    this.collection.insertOne( data )
                        .then( r => r.ops.length ? new Response( 201, r.ops ) : MongoDB.BadRequest )
                        .then( res )
                        .catch( rej );
                }
            }
        );
    }
    
    delete( obj )
    {
        return new Promise(
            ( res, rej ) => {
                if( this.isAcceptableObject( obj ) ) {
                    this.collection.deleteMany( obj )
                        .then(
                            r => r.deletedCount ? new Response( 200, this.toArray( obj ) ) : MongoDB.NoContent
                        )
                        .then( res )
                        .catch( rej );
                } else if( this.isObjectId( obj ) ) {
                    obj = { _id: this.toObjectId( obj ) };
                    
                    this.collection.deleteMany( obj )
                        .then(
                            r => r.deletedCount ? new Response( 200, this.toArray( obj ) ) : MongoDB.NoContent
                        )
                        .then( res )
                        .catch( rej );
                } else if( Array.isArray( obj ) ) {
                    const requests = obj.reduce(
                        ( r, item ) => {
                            if( item.hasOwnProperty( '_id' ) )
                                item._id = this.toObjectId( item._id );
                            
                            r.push( this.delete( item ) );
                            return r;
                        }, []
                    );
                    
                    Promise.all( requests )
                        .then(
                            result => result.reduce(
                                ( r, item, i ) => {
                                    if( item.getStatusCode() === 200 ) {
                                        r.data.push( { deleted: item.data } );
                                    } else {
                                        if( Array.isArray( item.data ) ) {
                                            if( item.isClientError() ) {
                                                r.data.push( { failed: item.data } );
                                            }
                                        }
                                    }
                                    
                                    if( i === result.length - 1 ) {
                                        const data = r.getData();
                                        
                                        // This is inaccurate but will do for now
                                        if( data.length === result.length ) {
                                            r.setStatusCode( 200 );
                                        } else if( !data.length ) {
                                            r.setStatusCode( 204 );
                                        } else {
                                            r.setStatusCode( 207 );
                                        }
                                    }
                                    
                                    return r;
                                }, new Response( 200, [] )
                            )
                        )
                        .then( res )
                        .catch( rej );
                } else {
                    res( MongoDB.BadRequest );
                }
            }
        );
    }
    
    put( obj )
    {
        return new Promise(
            ( res, rej ) => {
                if( this.isAcceptableObject( obj ) ) {
                    if( !obj.hasOwnProperty( '_id' ) ) {
                        return rej( MongoDB.NotImplemented );
                    }
                    
                    this.collection.updateOne( { _id: obj._id }, obj )
                        .then( r => r.modifiedCount ? new Response( 202, obj ) : MongoDB.NoContent )
                        .then( res )
                        .catch( rej );
                }
            }
        );
    }
    
    close()
    {
        this.db.close();
    }
}

MongoDB.NoContent          = Promise.resolve( new Response( 204, [] ) );
MongoDB.BadRequest         = Promise.resolve( new Response( 400, [] ) );
MongoDB.NotFound           = Promise.resolve( new Response( 404, [] ) );
MongoDB.PreconditionFailed = Promise.resolve( new Response( 412, [] ) );
MongoDB.NotImplemented     = Promise.resolve( new Response( 501, [] ) );

module.exports = MongoDB;