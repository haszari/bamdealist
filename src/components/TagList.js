import React from 'react';

function TagList( { tags } ) {
  const list = tags.map( ( tag ) => ( 
    <div className='tag' key={ tag } >{ tag }</div> 
  ) );

  return (
  <div className='tags'>
    { list }
  </div>
  );
}

export default TagList;
