import React from 'react';
import { useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';

import markdownRenderer from '../lib/markdown-renderer';

import { getArticle } from '../store/article/selectors';

import TagList from './TagList';

function Item() {
  const item = useSelector( getArticle );

  return (
    <>
      <div className='article' key={ item._id } >
        <h2 className='title' dangerouslySetInnerHTML={{
          __html:  markdownRenderer( item.title )
        }} />
        <div className='content'  dangerouslySetInnerHTML={{
          __html:  markdownRenderer( item.content )
        }} /> 
        <TagList tags={ item.tags } /> 
      </div> 
      <div className='article-toolbar'>
        <Button>Edit</Button>
      </div>
    </>
  );
}

export default Item;
