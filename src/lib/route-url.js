
export function listUrl( { tags, search } ) {
  const params = new URLSearchParams();
  tags.forEach( tag => {
    params.append( 'tag', tag );
  } );
  params.set( 'search', search );
  const url = params.toString();
  return `/?${ url }`;
}

export function articleUrl( id ) {
  return `/item/${ id }`;
}
