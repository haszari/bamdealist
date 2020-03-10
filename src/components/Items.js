import React from 'react';
import { useSelector } from 'react-redux';

import markdownRenderer from '../lib/markdown-renderer';

import { getItems } from '../store/selectors';

function Items() {
  const articles = useSelector( getItems );

  return articles.map( ( item ) => {
    return (
      <div className='article' key={ item._id } >
        <h2 className='title' dangerouslySetInnerHTML={{
          __html:  markdownRenderer( item.title )
        }} />
        <div className='content'  dangerouslySetInnerHTML={{
          __html:  markdownRenderer( item.content )
        }} /> 
      </div> 
    );
  } );
}

export default Items;
