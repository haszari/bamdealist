import { createAction } from '@reduxjs/toolkit';

import { apiBase } from '../../lib/api';
import { editArticleUrl } from '../../lib/route-url';

import { redirect } from '../app/actions';

import { getId, getArticle } from './selectors';

export const setId = createAction( 'article/setArticleId' );

export const articleReceived = createAction( 'article/itemReceived' );

export const setSaving = createAction( 'article/setSaving' );

export const setDirty = createAction( 'article/setDirty' );

const fetchArticle = async ( { id } ) => {
  const response = await fetch( `${ apiBase }Item/${ id }` );
  return response.json();
}

export const hydrateArticle = () => async ( dispatch, state ) => {
  const current = state();
  const id = getId( current );
  const response = await fetchArticle( { id } );
  dispatch( articleReceived( response ) );
}

export const newArticle = ( { title, content, userTags }  ) => async ( dispatch, state ) => {
  const newArticle = { 
    title, 
    content,
    userTags,
  };
  try {  
    const response = await fetch( `${ apiBase }Item`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( newArticle ),
    } );
    if ( 200 !== response.status ) {
    }
    const item = await response.json();
    dispatch( redirect( editArticleUrl( item._id ) ) );
  }
  catch ( error ) {
  }

}

export const persistArticle = ( { id, title, content, userTags }  ) => async ( dispatch, state ) => {
  dispatch( setSaving( true ) );
  dispatch( setDirty( false ) );

  const current = getArticle( state() )
  const newArticle = { 
    ...current,
    title, 
    content,
    userTags,
  };
  try {  
    const response = await fetch( `${ apiBase }Item/${ id }`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( newArticle ),
    } );
    if ( 200 !== response.status ) {
      dispatch( setDirty( true ) );
    }
  }
  catch ( error ) {
    // If save failed, then we're dirty again.
    dispatch( setDirty( true ) );
  }
  // update - various derived fields may have changed
  // const response = await fetchArticle( { id } );
  // dispatch( articleReceived( response ) );

  dispatch( setSaving( false ) );
}