import React from 'react';
import { useSelector } from 'react-redux';

import {
  getFilter,
  getTags,
} from '../store/list/selectors';

import { listUrl } from '../lib/route-url';

import Tag from './Tag';

function tagFontSize( tagHitCount, maxHitCount ) {
  const minSize = 6, sizeRange = 36;
  var size = 0;
  size = tagHitCount / maxHitCount;
  size = size * sizeRange;
  return size + minSize;
};

function TagCloud() {
  const { tags: filterTags, search } = useSelector( getFilter );
  const tags = useSelector( getTags );
  if ( ! tags || ! tags.length ) {
    return null;
  }

  let labelPrefix = '-'

  const currentTags = filterTags.map( tagText => {
    const remainder = filterTags.filter( tag => {
    return ( tag !== tagText );
  } );
    return ( 
      <Tag 
        key={ tagText }
        label={ labelPrefix + tagText }
        href={ 
          listUrl( {
            tags: remainder, 
            search
          } )
        }
      /> 
    );
  } );

  labelPrefix = filterTags.length ? '+' : '';

  const relatedTags = tags.filter( tag => {
    return ! filterTags.includes( tag.tag );
  } );
  const maxHitCount = relatedTags[0]?.count;

  const related = relatedTags.map( ( tag ) => {
    return ( 
      <Tag 
        key={ tag._id }
        fontSize={ tagFontSize( tag.count, maxHitCount ) }
        label={ labelPrefix + tag.tag }
        href={ 
          listUrl( {
            tags: [ 
              tag.tag,
              ...filterTags
            ],
            search
          } )
        }
      /> 
    );
  } );

  return (
    <div className='tags'>
      <div className='filter-tags'>
        { currentTags }
      </div>
      <div className='related-tags'>
        { related }
      </div>
    </div>
  );
}

export default TagCloud;
