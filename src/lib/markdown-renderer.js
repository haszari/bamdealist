// utilities for rendering markdown to html, including generating hashtag links

import marked from 'marked';
import hashtag from 'hashtag';

import { listUrl } from './route-url';

// Processes hashtags, either removing the hash 
// (so they are more readable in flowing text) 
// or converting to a link.
function processHashtags( md, asLinks = true ) {
   let expandedMd = md;

   const hashtags = hashtag.parse(md);
   const parserElements = hashtags.tokens;

   parserElements.map(element => {
      if ( element.type === 'text' ) {
         return element;
      }
      const url = listUrl( { tags: [ element.tag ] } );
      element.text = element.tag;
      if ( asLinks ) {
         element.text = `[${ element.tag }](${ url })`;
      }
      return element;
   });

   expandedMd = parserElements.reduce( ( memo, element ) => {
      return memo + element.text;
   }, '' );

   return expandedMd;
};

function markdownToHtml( md, options = {} ) {
   const { linkHashtags = true } = options;
   if ( ! md  ) {
      return '';
   }

   return marked(
      processHashtags( md, linkHashtags )
   );
};

export default markdownToHtml;
