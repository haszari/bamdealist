

export function tagUrl( ...tags ) {
  const params = new URLSearchParams();
  tags.forEach( tag => {
    params.append( 'tag', tag );
  } );
  const url = params.toString();
  return `/?${ url }`;
}

export function articleUrl( id ) {
  return `/item/${ id }`;
}
