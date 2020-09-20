import * as mdealib from '../../lib/mdealib.js';

import mongoose from 'mongoose';
import hashtagRegex from 'hashtag-regex';
import marked from 'marked';
import PlainTextRenderer from 'marked-plaintext';
import _ from 'lodash';

const MAX_CONTEXT_DEPTH = 3;


function generateTitle(item) {
   var title = '';
   if (!item.title) {
      if (item.type === 'listItem') {
         title = mdealib.trimMarkdown(item.content);
      }
      if (item.type === 'headingItem') {
         let maxContextHeading = _.maxBy(item.context, function(ctx) {
            return ctx.depth;
         });
         title = mdealib.trimMarkdown(maxContextHeading.markdown);
      }
      else {
         // last ditch content == title!
         title = item.content;
      }
   }
   return title;
};

function generateTextContent( item ) {
   var textContent = '';
   var renderer = new PlainTextRenderer();
   textContent += ' ' + marked( item.content || '', { renderer: renderer } );
   textContent += ' ' + marked( item.title || '', { renderer: renderer } );
   return textContent;
};


function normaliseTagsArray(tags) {
   tags = _.filter(tags, tag => {
      return _.isString(tag) && tag.length;
   });
   // remove leading or trailing underscores (and space)
   tags = _.map(tags, tag => {
      var trimmed = tag.trim();
      return trimmed.replace(/^_+|_+$/gm, '');
   });
   // special processing for some tags
   tags = _.map(tags, tag => {
      if (tag === 'tasks') return 'task';
      return tag;
   });
   // remove duplicates
   tags = _.uniqBy(tags, tag => tag.toLowerCase());
   // sort
   tags = _.sortBy(tags, tag => {
      return tag;
   });
   return tags;
};

// returns array of tags for each #hashtag in md (hashes removed!)
function parseHashtags(md) {
  if ( ! md ) {
    return [];
  }

  let tags = [];

  const regex = hashtagRegex();
  let match = regex.exec( md ) 
  while ( match ) {
    const tag = match[0];
    tags.push( tag.slice( 1 ) );
    match = regex.exec( md );
  }  

  return tags;
};

// returns array of tags for each "entity" in md
// entities are bold or italics, e.g. __Producer__ (bold) or *Work* (italics)
// whitespace is collapsed (may revise this)
function parseEntityTags(md) {
   if ( ! md ) {
      return [];
   }

   let tags = [];

   // Hook walkTokens and if we see bold or italic anywhere in the tree,
   // note down as a tag.
   let strongs = [];
   let ems = [];
   marked(
      md, 
      { 
         walkTokens: token => {
            // console.log( token );
            if ( token.type === 'em' ) {
               strongs.push( token.text );
            }
            if ( token.type === 'strong' ) {
               strongs.push( token.text );
            }
         }
      }
   );

   // Single array of all bold/italic items => tags.
   tags = strongs.concat(ems);

   // Process each tag content to ensure is a single "word".
   tags = tags.map(tag => {
      let stripped = tag;
      // strip html entities
      stripped = stripped.replace(/&.+;/g, '');
      // strip nonword chars
      stripped = stripped.replace(/\W/g, '');
      // console.log( `Saving stripped tag: ${ stripped }`)
      return stripped;
   });
   // console.log(tags);

   return tags;
};

// parses @usernames as tags
function parseHandleTags(md) {
   if (!md) return [];

   var tags = md.match(/@(\w)+/g);
   // strip @
   tags = _.map(tags, tag => {
      return tag.substring(1);
   });
   return tags;
};

// returns array of tags, generated from userTags string - extracts each word as a tag
function parseWordTagsFromString(userTagsString) {
   var tags = [];
   // pull out each word 3 or more chars long
   if (userTagsString) {
      var tagWords = /\W*(\w\w\w+)\W*/g;
      var match;
      while (match = tagWords.exec(userTagsString)) {
         if (match.length >= 1 && match[1])
            tags.push(match[1]);
      }
   }
   return tags;
};

// returns array of tags, generated from context array
// [ { markdown: '' ... } ]
function generateTagsFromContext(context) {
   var tags = [];
   // extract each markdown lexer token (e.g. list item, tag etc)
   tags = _.map(context, contextItem => {
      if (contextItem.markdown && contextItem.depth <= MAX_CONTEXT_DEPTH) {
         let tokens = marked.lexer(contextItem.markdown);
         return _.map(tokens, 'text');
      }
   });
   tags = _.flatten(tags);
   // now process those strings into tags ..
   // for now we'll just pull out all the words
   tags = _.map(tags, contextItem => {
      return parseWordTagsFromString(contextItem);
   });
   tags = _.flatten(tags);
   return tags;
};

function indexHashtags(item) {
   var titleTags = parseHashtags(item.title),
      contentTags = parseHashtags(item.content),
      userTags = parseWordTagsFromString(item.userTags);
   var titleEntities = parseEntityTags(item.title),
   contentEntities = parseEntityTags(item.content);
   var titleHandles = parseHandleTags(item.title),
   contentHandles = parseHandleTags(item.content);

   var tags = titleTags.concat(contentTags);
   tags = tags.concat(userTags);

   tags = tags.concat(contentEntities);
   tags = tags.concat(titleEntities);

   tags = tags.concat(titleHandles);
   tags = tags.concat(contentHandles);

   return normaliseTagsArray(tags);
};

function appendTagsFromContext(contextArray, userTagsString) {
   if (!userTagsString)
      userTagsString = '';
   var contextTags = generateTagsFromContext(contextArray);
   var contextTagsAsString = contextTags.join(' ');
   return userTagsString + ' ' + contextTagsAsString;
}

var schema = mongoose.Schema({
   //// for real mdealist fields edited by user ...

   // these are both markdown
   title: String,
   content: String,

   // plain text - we store what the user types, tags are space delimited words
   userTags: String,

   //// for real fields generated/managed by system ...
  
   // we use this like an index, so it's persisted
   // these are the tags that are displayed to the user, so we preserve case
   tags: [ String ],
   // we keep a lower case copy of tags for tag search (so it's not case sensitive)
   lowerCaseTags: [ String ],
   // text content for indexing - markdown breaks indexing with bold/italics etc
   // this includes both title and content (i.e. everything that is markdown)
   textContent: String,

   // importer fields, useful
   filename: String, // where it came from

   // dates!
   originated: { type: Date, default: Date.now() },
   updated: Date,
   imported: Date,

   // importer fields, dubious importance
   type: String,
   context: [ { markdown: String, depth: Number } ]
});

function extractTagCreatedDate(item) {
   var defaultOrigination = new Date(2016, 5, 15);
   var itemCreatedEstimate = defaultOrigination;
   var gotFromTags = false;
   _.each(item.tags, tagValue => {
      switch (tagValue.toLowerCase()) {
         case 'january':
         case 'jan':
            itemCreatedEstimate.setMonth(0);
            break;
         case 'february':
         case 'feb':
            itemCreatedEstimate.setMonth(1);
            break;
         case 'march':
         case 'mar':
            itemCreatedEstimate.setMonth(2);
            break;
         case 'april':
         case 'apr':
            itemCreatedEstimate.setMonth(3);
            break;
         case 'may':
            itemCreatedEstimate.setMonth(4);
            break;
         case 'june':
         case 'jun':
            itemCreatedEstimate.setMonth(5);
            break;
         case 'july':
         case 'jul':
            itemCreatedEstimate.setMonth(6);
            break;
         case 'august':
         case 'aug':
            itemCreatedEstimate.setMonth(7);
            break;
         case 'september':
         case 'sept':
         case 'sep':
            itemCreatedEstimate.setMonth(8);
            break;
         case 'october':
         case 'oct':
            itemCreatedEstimate.setMonth(9);
            break;
         case 'november':
         case 'nov':
            itemCreatedEstimate.setMonth(10);
            break;
         case 'december':
         case 'dec':
            itemCreatedEstimate.setMonth(11);
            break;
         default: 
            break;
      }

      const rxYearMonthDay = /(\d\d\d\d)(\d\d)(\d\d)/;
      const ymd = rxYearMonthDay.exec(tagValue);
      if (ymd) {
         itemCreatedEstimate.setYear(ymd[1]);
         itemCreatedEstimate.setMonth(ymd[2] - 1);
         itemCreatedEstimate.setDate(ymd[3]);
         gotFromTags = true;
      }
      const rxYearMonth = /(\d\d\d\d)(\d\d)/;
      const ym = rxYearMonth.exec(tagValue);
      if (ym) {
         itemCreatedEstimate.setYear(ym[1]);
         itemCreatedEstimate.setMonth(ym[2] - 1);
         gotFromTags = true;
      }
      const rxYear = /(\d\d\d\d)/;
      const yea = rxYear.exec(tagValue);
      if (yea) {
         itemCreatedEstimate.setYear(yea[1]);
         gotFromTags = true;
      }
   });
   if (gotFromTags) {
      return itemCreatedEstimate;
   }
   return defaultOrigination;
};

// create a text index so we can do full-text search
schema.index({
   // this contains (generated) plain text of the markdown bits (title & content)
   textContent: 'text',
   // also index on the markdown so the urls in links etc are indexed
   content: 'text',
   title: 'text',
   // and of course index tags too
   userTags: 'text'
});

schema.methods.generateOriginatedDateFromTags = function() {
   var item = this;
   this.originated = extractTagCreatedDate(item);
};

schema.methods.setImportDateNow = function() {
   this.imported = Date.now();
};


schema.methods.normalise = function() {
   var item = this;
   if ( ! this.title )
      this.title = generateTitle( item );

   // system-managed fields
   this.tags = indexHashtags(item);
   this.lowerCaseTags = _.map( this.tags, tag => tag.toLowerCase() );
   this.textContent = generateTextContent( item );
};

// Once only (i.e. when importing) we need to extract tags from context.
// We put these in userTags so they user can tweak them as needed or use as-is.
// Note that normalise() (above) processes userTags (via indexHashtags), so this should be run first.
schema.methods.importContextTags = function() {
   this.userTags = appendTagsFromContext(this.context, this.userTags);
};

schema.pre('save', function(next) {
   this.normalise();
   this.updated = Date.now();
   next();
});


const ItemModel = mongoose.model('Item', schema);

export default ItemModel;
