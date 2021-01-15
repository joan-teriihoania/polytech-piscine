  
/**
 * Shows how to use chaining rather than the `serialize` method.
 */
"use strict";

const fs = require('fs');
const server = require('./server')
var ObjectId = require('mongodb').ObjectId; 
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var database = undefined
client.connect().then(() => {
    database = client.db('piscine');

    
    fs.readFile("./database_template.json", function(err, database_template){
        database_template = JSON.parse(database_template.toString())
        for (const [tablename, rows] of Object.entries(database_template)) {
            console.log("[DB-CONFIG] Table " + tablename + " configured")
            database.listCollections().toArray(function(err, items) {
              items = items.map(a => a.name)
              if(!items.includes(tablename)){
                database.createCollection(tablename)
              }
            })
        }
    })
})

function checkObjectId(text){
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")
  return checkForHexRegExp.test(text)
}

module.exports = {
    isConnected: function(){
      return (database != undefined)
    },
    createTable: function(tablename){
        database.createCollection(tablename)
    },
    insert: function(tablename, rows) {
      database.collection(tablename).insertOne(rows)
    },
    deleteOne: function(tablename, query, callback){
        if(query['_id'] && checkObjectId(query['_id'])){query['_id'] = ObjectId(query['_id'])}
      database.collection(tablename).deleteOne(query).then((result) => {
        callback(result)
      }).catch((err) => {
        callback(err)
      })
    },
    selectOne: function(tablename, query, options, callback) {
        if(query['_id'] && checkObjectId(query['_id'])){query['_id'] = ObjectId(query['_id'])}
        database.collection(tablename).findOne(query, options).then((result) => {
          callback(result)
        }).catch((err) => {
          callback(err)
        })
    },
    selectAll: function(tablename, query, options, callback) {
        if(query['_id'] && checkObjectId(query['_id'])){query['_id'] = ObjectId(query['_id'])}
        database.collection(tablename).find(query, options).toArray().then((result) => {
          callback(result) // returns array
        }).catch((err) => {
          callback(err)
        })
    },
    update: function(tablename, query, fields, callback){
      if(query['_id'] && checkObjectId(query['_id'])){query['_id'] = ObjectId(query['_id'])}
      const options = { upsert: true };
      const updateDoc = {$set: fields};
      database.collection(tablename).updateOne(query, updateDoc, options).then((result) => {
        callback(result)
      }).catch((err) => {
        callback(err)
      })
    },
    closeDB: function() {
        client.close();
    }
}