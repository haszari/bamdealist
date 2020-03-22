import React from 'react';

import { listUrl } from '../lib/route-url';

import Tag from './Tag';

function TagList( { tags } ) {
  if ( ! tags ) {
    return null;
  }

  const list = tags.map( ( tag ) => ( 
    <Tag 
      key={ tag }
      label={ tag }
      href={ listUrl( { tags: [ tag ] } ) }
    /> 
  ) );

  return (
  <div className='tags'>
    { list }
  </div>
  );
}

export default TagList;
