import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';

import markdownRenderer from '../lib/markdown-renderer';
import { editArticleUrl } from '../lib/route-url';

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
        <Button 
          variant='contained' 
          color='primary'
          component={ Link }
          to={ editArticleUrl( item._id ) }
        >
          Edit
        </Button>
      </div>
    </>
  );
}

export default Item;
