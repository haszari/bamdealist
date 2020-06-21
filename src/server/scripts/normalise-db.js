// --- This is not maintained, may not work ---

// Run a normalise over all items in the db.

import mongoose from 'mongoose';

import ItemModel from '../models/item.js';

import connectToDb from '../db/connection.js';
let db = connectToDb();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

   ItemModel.find({}, function(err, items) {
      let savePromises = [];
   
      items.forEach(item => {
         const oldTags = item.tags;
         // in previous runs I've needed to regenerate tags from context
         // now I just want to normalise
         // item.importContextTags();
         // this is not needed explicitly;
         // as it's our pre save middleware (see `models/item`)
         //item.normalise(); 
         savePromises.push(item.save());
         
         const oldTagsStr = oldTags.join( ' ' );
         const newTagsStr = item.tags.join( ' ' );
         if ( item.tags.length > oldTags.length ) {
            console.log( `😀 normalise added tags to item ${ item._id }:` );
            console.log( `  ${ oldTagsStr }` );
            console.log( `  ${ newTagsStr }` );
            console.log( '' );
         }
         else if ( item.tags.length < oldTags.length ) {
            console.log( `🧐 normalise LOST TAGS from item ${ item._id }:` );
            console.log( `  ${ oldTagsStr }` );
            console.log( `  ${ newTagsStr }` );
            console.log( '' );
         }
      });

      Promise.all(savePromises).then(function() {
         // need to disconnect so script terminates
         // (if I do more operations then I'll need promises for when.all.done() thing)
         mongoose.disconnect();
      });
   });
});



