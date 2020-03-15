import { createAction } from '@reduxjs/toolkit';

import { apiBase } from '../../lib/api';

import { getId } from './selectors';

export const setId = createAction( 'article/setArticleId' );

export const articleReceived = createAction( 'transport/itemsReceived' );

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
