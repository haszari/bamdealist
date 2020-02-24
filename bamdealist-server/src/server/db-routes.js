// Persistence layer and REST API handlers.

const _ = require('underscore');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const express = require('express');
const router = express.Router();

var appConfig = require('../../app.config');

const ItemModel = require('./models/item');

import connectToDb from './db/connection';

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
   hiddenTagsStringOrRegex = _.map(hiddenTagsStringOrRegex, hideItem => {
      if (_.isString(hideItem)) return hideItem.toLowerCase();
      return hideItem;
   });

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
   router.get(API_PATH + '/lucky', function(request, response) {
      var matchQuery = {};
      if (request.query.query) {
         matchQuery = JSON.parse(request.query.query);
      }
      ItemModel.find(matchQuery,
         function(err, result) {
            var winner = _.sample(result);
            if (err) return console.log(err);
            response.send(winner);
         }
      );
   });
});

module.exports = router;
