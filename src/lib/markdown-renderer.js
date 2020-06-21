// utilities for rendering markdown to html, including generating hashtag links

import marked from 'marked';
import hashtagRegex from 'hashtag-regex';

import { listUrl } from './route-url';

// Processes hashtags, either removing the hash 
// (so they are more readable in flowing text) 
// or converting to a link.
function processHashtags( md, asLinks = true ) {
  if ( ! md ) { return; }

  const regex = hashtagRegex();
  
  const expandedMd = md.replace( regex, ( htag ) => {
    const tag = htag.slice( 1 );
    if ( asLinks ) {
      const url = listUrl( { tags: [ tag ] } );
      return `[${ tag }](${ url })`;
    }

    return tag;
  } );

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
