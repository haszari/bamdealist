import React from 'react';
import { useSelector } from 'react-redux';

import { getItems } from '../store/selectors';

function Items() {
  const articles = useSelector( getItems );

  return articles.map( ( item ) => {
    return (
      <div className='article' key={ item._id } >
        <div className='title' >{ item.title }</div> 
        <div className='content' >{ item.content }</div> 
      </div> 
    );
  } );
}

export default Items;
