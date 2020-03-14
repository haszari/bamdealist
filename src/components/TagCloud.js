import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getTags } from '../store/selectors';

function tagFontSize( tagHitCount, maxHitCount ) {
  const minSize = 8, sizeRange = 30;
  var size = 0;
  size = tagHitCount / maxHitCount;
  size = size * sizeRange;
  return size + minSize;
};

function tagUrl( tag ) {
  const params = new URLSearchParams();
  params.set( 'tag', tag );
  const url = params.toString();
  return `/?${ url }`;
}

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
      <div className='tag' style={ styles } key={ tag._id } >
        <Link to={ tagUrl( tag.tag ) }>{ tag.tag }</Link>
      </div> 
    );
  } );

  return (
     <div className='tags'>
       { cloud }
     </div>
  );
}

export default TagCloud;
