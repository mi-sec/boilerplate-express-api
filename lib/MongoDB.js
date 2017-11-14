/** ****************************************************************************************************
 * File: MongoDB.js
 * Project: boilerplate-express-api
 * @author Nick Soggin <iSkore@users.noreply.github.com> on 14-Nov-2017
 *******************************************************************************************************/
'use strict';
// @formatter:off

const
    { MongoClient } = require( 'mongodb' ),
    { mongodb }     = require( '../config' );

class MongoDB
{
    constructor( databaseName = 'default', collectionName = 'default' )
    {
        this.url = `${mongodb.protocol}${mongodb.host}:${mongodb.port}/${databaseName}`;
        this.databaseName = databaseName;
        this.collectionName = collectionName;
        
        MongoClient.connect(
            this.url,
            ( e, d ) => {
                console.log( e );
                console.log( d );
            }
        );
        
        // this.databaseName = databaseName;
        // this.collection = db.get( databaseName );// || db.collection( databaseName );
        
        // this.collection.index( 'name last' );
        // this.collection.insert( { name: 'Tobi' } );
        
        // this.collection.remove( { _id: '5a0b0132aeb7740f34e5e554' } );
    }
    
    all()
    {
        return this.collection.find( {} );
    }
    
    getID( _id )
    {
        return this.collection.find( { _id } );
    }
    
    insert( data )
    {
        return this.collection.insert( data );
    }
}

const ok = new MongoDB( 'metadata' );

// ok.all().then( console.log );
// ok.getID( '5a0b01380550be0f37c8c7da' ).then( console.log );
// ok.insert( { hello: 'world' } ).then( console.log );
