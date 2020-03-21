import _ from 'lodash';

import express from 'express';
import restify from 'express-restify-mongoose';

import connectToDb from './db/connection.js';
import ItemModel from './models/item.js';
import appConfig from '../app.config.js';

// Persistence layer and REST API handlers.

const router = express.Router();

let db = connectToDb();

const API_PREFIX = '/api';
const API_VERSION = '/v1';
const API_PATH = API_PREFIX + API_VERSION;

// regular REST routes for Item collection
restify.serve(router, ItemModel, {
   prefix: API_PREFIX,
   version: API_VERSION,

   // if we don't specify this our mongo.pre('save') middleware won't run
   findOneAndUpdate: false
});

db.on('error', function(err) { console.log('db error: ', err.message); });

// set up custom APIs
db.once('open', function() {
   var hiddenTagsStringOrRegex = appConfig.app.hiddenTags || [];
   hiddenTagsStringOrRegex = hiddenTagsStringOrRegex.map( hideItem => {
      if (_.isString(hideItem)) return hideItem.toLowerCase();
      return hideItem;
   } );

   // tag cloud api, optionally filtered by tag/text search
   router.get(API_PATH + '/tags', function(request, response) {
      var matchQuery = {};
      if (request.query.query) {
         matchQuery = JSON.parse(request.query.query);
      }
      ItemModel.aggregate([
         { $match: matchQuery },
         { $project: { tags: 1 } },
         { $unwind: "$tags" },
         { $group: {
            _id: { $toLower: "$tags" },
            count: { $sum: 1 },
            tag: { $first: "$tags" }
         } },
         { $match: { _id: { $nin: hiddenTagsStringOrRegex } } },
         { $sort: { count: -1 } },
      ]).exec( function(err, result) {
         if (err) return console.log(err);
         response.send(result);
      } );
   });

   // randomly pick an item, optionally filtered by tag/text search
   router.get( API_PATH + '/lucky', function( request, response ) {
      let matchQuery = {}, limit = 1;
      if ( request.query.query ) {
         matchQuery = JSON.parse( request.query.query );
      }
      if ( request.query.limit ) {
         limit = parseInt( request.query.limit );
      }
      ItemModel.aggregate( [
         { $match: matchQuery },
         { $sample: { size: limit } }, 
      ] ).exec( function( err, result ) {
         if ( err ) return console.log( err );
         response.send( result );
      } );
   } );

});

export default router;
