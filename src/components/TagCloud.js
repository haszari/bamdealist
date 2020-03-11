import React from 'react';
import { useSelector } from 'react-redux';

import { getTags } from '../store/selectors';

const tagFontSize = function( tagHitCount, maxHitCount ) {
  const minSize = 8, sizeRange = 30;
  var size = 0;
  size = tagHitCount / maxHitCount;
  size = size * sizeRange;
  return size + minSize;
};

function TagCloud() {
  const tags = useSelector( getTags );
  if ( ! tags || ! tags.length ) {
    return null;
  }

  const maxHitCount = tags[0].count;

  const cloud = tags.map( ( tag ) => {
    const styles = {
      fontSize: tagFontSize( tag.count, maxHitCount ),
    };
    return (
      <div className='tag' style={ styles } key={ tag._id } >{ tag.tag }</div> 
    );
  } );

  return (
     <div className='tags'>
       { cloud }
     </div>
  );
}

export default TagCloud;
