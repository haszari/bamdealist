import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

import * as mdealib from "../../lib/mdealib";

import moment from 'moment';

import mongoose from 'mongoose';

import Promise from 'bluebird';

import commandLineArgs from 'command-line-args';

import ItemModel from '../models/item';

import connectToDb from '../db/connection';

mongoose.Promise = Promise;

let markdownPattern = /.*\.md$/;
let archiveFileTimeFormat = 'YYYYMMDD-HHMMss.SS';

let defaultFileContent = "## tasks\n\n\## history\n\n";

function processFile(pathName, archiveFolder) {
   let savePromises = [];

   // no filename passed in
   if (!pathName) return savePromises;

   // does filename match our pattern?
   if (!markdownPattern.test(pathName)) return savePromises;

   let fileContent = fs.readFileSync(pathName, 'utf8');

   let items = mdealib.importMarkdownDiary(fileContent, 4, pathName);
   items.forEach(function(item) {
      let newItem = new ItemModel(item);
      newItem.importContextTags();
      newItem.normalise(); // important because generateOriginatedDateFromTags relies on tags (not userTags!)
      // and normalise generates .tags
      newItem.generateOriginatedDateFromTags();
      newItem.setImportDateNow();
      savePromises.push(newItem.save());
   });

   if (archiveFolder) {
      // archive original file with timestamp
      let sourceFileNameParts = path.parse(pathName);
      let archiveFileName = sourceFileNameParts.name +
         '--' + moment().format(archiveFileTimeFormat) +
         sourceFileNameParts.ext;
      let archivedFilePath = path.join(archiveFolder, archiveFileName);
      mkdirp.sync(archiveFolder);
      fs.writeFileSync(archivedFilePath, fileContent);

      // clear out source file
      //fs.truncateSync(pathName, 0);
      fs.writeFileSync(pathName, defaultFileContent);
   }

   return savePromises;
}

function processFolder(pathName, archiveFolder) {
   if (!pathName) return [];

   let savePromises = [];

   var files = fs.readdirSync(pathName);

   for (var i=0;i<files.length;i++) {
      var filename = path.join(pathName, files[i]);
      var stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
         savePromises = savePromises.concat(processFolder(filename, archiveFolder));
      }
      else if (stat.isFile()) {
         savePromises = savePromises.concat(processFile(filename, archiveFolder));
      };
   };

   return savePromises;
}

function processFolderOrFile(pathName, archiveFolder) {
   if (!pathName) return [];

   let savePromises = [];

   let fstat = fs.lstatSync(pathName);
   if (fstat.isDirectory()) {
      savePromises = savePromises.concat(processFolder(pathName, archiveFolder));
   }
   if (fstat.isFile()) {
      savePromises = savePromises.concat(processFile(pathName, archiveFolder));
   }

   return savePromises;
};

var cli = commandLineArgs([
   {
      name: 'file', alias: 'f', type: String, defaultOption: true,
      description: 'Markdown file to import items from.'
   },
   {
      name: 'archive', alias: 'a', type: String,
      description: 'Archive the file after importing. Option specifies the folder to archive to. If this option is set, the source file will be cleared after import (so can be reused).'
   }
]);

var options = cli.parse();

if (options.file) {

   let db = connectToDb();

   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function() {

      let todos = processFolderOrFile(options.file, options.archive);

      Promise.all(todos).then(function() {
         // need to disconnect so script terminates
         // (if I do more operations then I'll need promises for when.all.done() thing)
         mongoose.disconnect();
      });
   });

}
else {
   console.log(cli.getUsage());
}
