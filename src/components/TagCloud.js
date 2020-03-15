import React from 'react';
import { useSelector } from 'react-redux';

import { getTags } from '../store/selectors';

import Tag from './Tag';

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
    return ( 
      <Tag 
        key={ tag._id }
        fontSize={ tagFontSize( tag.count, maxHitCount ) }
        label={ tag.tag }
        href={ tagUrl( tag.tag ) }
      /> 
    );
  } );

  return (
     <div className='tags'>
       { cloud }
     </div>
  );
}

export default TagCloud;
