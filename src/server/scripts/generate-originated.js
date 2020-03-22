// --- This is not maintained, may not work ---

// Ensure all the items have an originated date, generated from tags.

import mongoose from 'mongoose';

import ItemModel from '../models/item';

import connectToDb from '../db/connection';
let db = connectToDb();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

   ItemModel.find({ }, function(err, items) {
      let savePromises = [];

      items.forEach(item => {
         item.generateOriginatedDateFromTags();
         savePromises.push(item.save());
      });

      Promise.all(savePromises).then(function() {
         // need to disconnect so script terminates
         // (if I do more operations then I'll need promises for when.all.done() thing)
         mongoose.disconnect();
      });
   });
});
