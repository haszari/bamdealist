import React from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import markdownRenderer from '../lib/markdown-renderer';

import { getItems } from '../store/list/selectors';

import { articleUrl } from '../lib/route-url';

import TagList from './TagList';

function Items() {
  const items = useSelector( getItems );

  const articles = items.map( ( item ) => {
    return (
      <div className='article' key={ item._id } >
        <Link to={ articleUrl( item._id ) }>
          <h2 className='title' dangerouslySetInnerHTML={{
            __html: markdownRenderer( item.title, { linkHashtags: false } )
          }} />
        </Link>
        <div className='content'  dangerouslySetInnerHTML={{
          __html:  markdownRenderer( item.content )
        }} /> 
        <TagList tags={ item.tags } /> 
      </div> 
    );
  } );

  return (
     <div className='articles'>
       { articles }
     </div>
  );
}

export default Items;
