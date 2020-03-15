import React from 'react';

import { tagUrl } from '../lib/route-url';

import Tag from './Tag';

function TagList( { tags } ) {
  const list = tags.map( ( tag ) => ( 
    <Tag 
      key={ tag }
      label={ tag }
      href={ tagUrl( tag ) }
    /> 
  ) );

  return (
  <div className='tags'>
    { list }
  </div>
  );
}

export default TagList;
