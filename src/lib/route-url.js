/**
  Utility functions for generating urls to app routes.
 */


export function listUrl( { tags, search, shuffle } ) {
  const params = new URLSearchParams();
  tags.forEach( tag => {
    params.append( 'tag', tag );
  } );
  if ( search ) {
    params.set( 'search', search );
  }
  if ( shuffle ) {
    params.set( 'limit', shuffle );
    return `/lucky/?${ params.toString() }`;
  }
  return `/?${ params.toString() }`;
}

export function articleUrl( id ) {
  return `/item/${ id }`;
}

export function editArticleUrl( id ) {
  return `/edit/${ id }`;
}
