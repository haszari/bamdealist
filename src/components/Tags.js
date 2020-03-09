import React from 'react';
import { useSelector } from 'react-redux';

import { getTags } from '../store/selectors';

function Tags() {
  // todo put this in store/selectors
  const tags = useSelector( getTags );

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
