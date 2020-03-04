// this is really deprecated - tend to use mongo shell instead

import mongoose from 'mongoose';

import ItemModel from '../models/item';

import connectToDb from '../db/connection';
let db = connectToDb();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

   ItemModel.remove({}, function() {
      console.log('removed all items from DB');

      // need to disconnect so script terminates
      // (if I do more operations then I'll need promises for when.all.done() thing)
      mongoose.disconnect();
   });
});



