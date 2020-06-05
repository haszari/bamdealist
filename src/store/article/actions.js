import { createAction } from '@reduxjs/toolkit';

import { apiBase } from '../../lib/api';

import { getId, getArticle } from './selectors';

export const setId = createAction( 'article/setArticleId' );

export const articleReceived = createAction( 'article/itemsReceived' );

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
  await fetch( `${ apiBase }Item/${ id }`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( newArticle ),
  } );
  // update - various derived fields may have changed
  // const response = await fetchArticle( { id } );
  // dispatch( articleReceived( response ) );

  // todo handle errors
  // if error, setDirty( true ) again

  dispatch( setSaving( false ) );
}