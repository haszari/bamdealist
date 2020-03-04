import React from 'react';

function Tags( { tags } ) {
  return tags.map( ( tag ) => {
    const styles = {
      fontSize: tag.count,
      display: 'inline-block',
      margin: '10px',
    };
    return (
      <div className='tag' style={ styles } key={ tag._id } >{ tag.tag }</div> 
    );
  } );
}

export default Tags;
