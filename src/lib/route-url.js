
export function tagUrl( tag ) {
  const params = new URLSearchParams();
  params.set( 'tag', tag );
  const url = params.toString();
  return `/?${ url }`;
}
