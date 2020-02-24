var _ = require('underscore');
//var mongodb = require('mongodb');
var marked = require('marked');

function normaliseItem(item) {
   // mongodb is node-only lib .. we'll use random number for now
   //item.id = new mongodb.ObjectID(); 
   //item.id = Math.random();
   item.updated = Date.now();
   return item;
}

/*
Trim markdown - remove leading '-', or whitespace.
*/
export function trimMarkdown(markdown) {
   let tidied = '';
   if (markdown)
      tidied = markdown.trim(); // re-trim it later with the regex but this gets us started
   tidied = tidied.replace(/^(-|\s)*/, "");
   return tidied;
}

/*
   Regex for detecting whitespace at start of line.
*/
let startsWithWhitespace = /^(\s)+/;
/*
   Regex for detecting start/end of a GFM fenced code block.
*/
let startsWithFence = /^(\s)*(`{3,}|~{3,})/;

/*
Import a markdown diary.
Returns an array of items, ready for storing in a database etc.
Each item is a task or a diary item (H4 item under H3 date).
*/
export function importMarkdownDiary(mdsrc, splitHeadingLevel, filename) { 
   var items = [{
      lines: []
   }];

   if (!splitHeadingLevel) {
      splitHeadingLevel = 4;
   }

   // get all the lines in the file
   var mdsrclines = mdsrc.split('\n');

   var mode = 'idle'; // 'idle' || 'tasks' || 'history'
   var contextLines = []; // array of { md: , level: }
   var currentItem = 0;
   var ignoringLinesForFencedBlock = false;
   var makeNextItem = function() {
      currentItem++;
      items.push({
         lines: []
      });
   };

   mdsrclines.forEach(function(line) {
      // md-parse the line
      let tokens = marked.lexer(line);
      
      // check for a fenced code block
      // this might contain stuff that looks like headings/context!
      if (startsWithFence.test(line)) {
         if (!ignoringLinesForFencedBlock) {
            // start ignoring lines (for headings) - we're in a code block
            ignoringLinesForFencedBlock = true;
         }
         else {
            // we were in a fenced block, so this marks the end, so stop ignoring
            ignoringLinesForFencedBlock = false;
         }
      }

      // what are we looking at? heading or other
      if (!ignoringLinesForFencedBlock && 
         tokens.length && tokens[0].type == 'heading' && 
         tokens[0].depth <= splitHeadingLevel) {
         // this is a heading we might split on..
         var headingLevel = tokens[0].depth;
         var headingText = tokens[0].text;

         // if we are h2, check whether we change mode
         var prevMode = mode;
         if (headingLevel == 2) {
            if (headingText == 'tasks') {
               mode = 'listItem';
            }
            else if (headingText == 'history') {
               mode = 'headingItem';
            }
            else { mode = 'idle'; }
         }

         // are we on a new item?
         var modeChanged = prevMode != mode;
         var newDiaryItem = (headingLevel <= splitHeadingLevel);
         if (newDiaryItem || modeChanged) {
            makeNextItem();
         }

         // filter out headings that this supercedes
         contextLines = _.filter(contextLines, function(c) {
            return c.depth < headingLevel;
         });

         // save this heading to the context
         contextLines.push({
            markdown: line, 
            depth: headingLevel
         });
      }
      else {
         // if we've just finished a listitem, bump and move on
         let isSubitem = startsWithWhitespace.test(line);
         if (mode == 'listItem' && !isSubitem) {
            makeNextItem();
         }

         // just update the current item and proceed
         items[currentItem].lines.push(line);
         items[currentItem].type = mode;
         items[currentItem].context = contextLines;
      }
   });

   var tidyItems = _.map(items, function(item) {
      return {
         content: item.lines.join('\n'),
         context: item.context,
         type: item.type,
         filename: filename
      };
   });

   tidyItems = _.filter(tidyItems, function(tidy) {
      var typeOk = tidy.type == 'listItem' || tidy.type == 'headingItem';
      var contentOk = tidy.content.length;
      return (contentOk && typeOk);
   });

   tidyItems = _.map(tidyItems, normaliseItem);

   return tidyItems;
};
