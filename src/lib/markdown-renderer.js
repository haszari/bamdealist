// utilities for rendering markdown to html, including generating hashtag links

import marked from 'marked';
import hashtag from 'hashtag';

import { tagUrl } from './route-url';

// returns md with hashtags expanded to markdown links
function expandHashtags( md ) {
   let expandedMd = md;

   const hashtags = hashtag.parse(md);
   const parserElements = hashtags.tokens;

   parserElements.map(element => {
      if ( element.type === 'text' ) {
         return element;
      }
      const url = tagUrl( element.tag );
      element.text = `[${ element.tag }](${ url })`;
      return element;
   });

   expandedMd = parserElements.reduce( ( memo, element ) => {
      return memo + element.text;
   }, '' );

   return expandedMd;
};

function markdownToHtml( md, tagBaseUrl ) {
   if ( md ) {
      return marked(
         expandHashtags( md, tagBaseUrl )
      );
   }
   return '';
};

export default markdownToHtml;
