import _ from 'lodash';
import marked from 'marked';

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

   // parser / importer mode
   // ## tasks => 'listItem' (default) OR
   // ## history => 'headingItem'
   // tasks imports each line as a new item, including any subsequent indented lines
   // history imports h4-delimited article items
   // H1 sets to task mode by default
   // mode is (optionally) changed by H2 headings - `history` imports articles, anything else switches to task mode
   const LIST_MODE_TYPE = 'listItem';
   const LIST_H2_KEYWORD = 'tasks';
   const HEADING_MODE_TYPE = 'headingItem';
   const HEADING_H2_KEYWORD = 'history';
   const DEFAULT_MODE = LIST_MODE_TYPE;
   var mode = LIST_MODE_TYPE; 

   var contextLines = []; // array of { md: , level: }
   var currentItem = 0;
   var ignoringLinesForFencedBlock = false;
   var makeNextItem = function() {
      currentItem++;
      items.push({
         lines: []
      });
   };

   const updateContext = ( line, headingLevel ) => {
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

   mdsrclines.forEach(function(line) {
      // md-parse the line
      let tokens = marked.lexer(line);
      
      // check for a fenced code block
      // this might contain stuff that looks like headings/context!
      if ( startsWithFence.test( line ) ) {
         if ( ! ignoringLinesForFencedBlock ) {
            // start ignoring lines (for headings) - we're in a code block
            ignoringLinesForFencedBlock = true;
         }
         else {
            // we were in a fenced block, so this marks the end, so stop ignoring
            ignoringLinesForFencedBlock = false;
         }
      }

      const isHeading = tokens.length && tokens[0].type === 'heading';

      // If this is H1, H2 or H3, set context tags and update mode.
      if ( ! ignoringLinesForFencedBlock && 
         isHeading && 
         tokens[0].depth < splitHeadingLevel) {

         // this is a heading we might split on..
         var headingLevel = tokens[0].depth;
         var headingText = tokens[0].text;
         var prevMode = mode;

         // if we are h1, set default (list) mode
         if ( headingLevel === 1 ) {
            mode = DEFAULT_MODE;
         }

         // if we are h2, check whether we change mode
         if ( headingLevel === 2 ) {
            if ( headingText === LIST_H2_KEYWORD ) {
               mode = LIST_MODE_TYPE;
            }
            else if ( headingText === HEADING_H2_KEYWORD ) {
               mode = HEADING_MODE_TYPE;
            }
            else { mode = DEFAULT_MODE; }
         }

         /// not sure if this is doing anything useful
         var modeChanged = prevMode !== mode;
         if ( modeChanged ) {
            makeNextItem();
         }

         updateContext( line, tokens[0].depth );

         return;
      }

      // If this is H4-splitHeadingLevel then cut off previous item and start new one.
      if ( ! ignoringLinesForFencedBlock && 
         isHeading && 
         tokens[0].depth === splitHeadingLevel) {

         makeNextItem();

         updateContext( line, tokens[0].depth );

         return;
      }

      // if we get to here we are some content that needs to be stored in an item

      // if we've just finished a listitem, bump and move on
      let isSubitem = startsWithWhitespace.test(line);
      if ( mode === LIST_MODE_TYPE && ! isSubitem ) {
         makeNextItem();
      }

      // just update the current item and proceed
      items[currentItem].lines.push( line );
      items[currentItem].type = mode;
      items[currentItem].context = contextLines;
   });

   var tidyItems = _.map(items, function(item) {
      return {
         content: item.lines.join('\n').trim(),
         context: item.context,
         type: item.type,
         filename: filename
      };
   });

   tidyItems = _.filter( tidyItems, function( tidy ) {
      var typeOk = tidy.type === LIST_MODE_TYPE || tidy.type === HEADING_MODE_TYPE;
      var contentOk = tidy.content.length;
      return ( contentOk && typeOk );
   });

   tidyItems = _.map(tidyItems, normaliseItem);

   return tidyItems;
};
