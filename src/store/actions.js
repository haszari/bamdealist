import { createAction } from '@reduxjs/toolkit';

import { getPagination } from '../store/selectors';

export const tagsReceived = createAction( 'transport/tagsReceived' );

export const itemsReceived = createAction( 'transport/itemsReceived' );

const apiBase = 'http://localhost:8947/api/v1/';

const fetchTags = async () => {
  const response = await fetch( `${ apiBase }tags` );
  return response.json();
}

const fetchItems = async ( { limit = 1, skip = 0 } ) => {
  const response = await fetch( `${ apiBase }Item/?limit=${ limit }&skip=${ skip }&sort={"originated":-1}` );
  return response.json();
}

export const hydrateTags = () => async dispatch => {
  // todo dispatch a "isLoading" event
  const response = await fetchTags();
  dispatch( tagsReceived( response ) );
}

export const hydrateItems = () => async ( dispatch, state ) => {
  // todo dispatch a "isLoading" event
  const response = await fetchItems( getPagination( state() ) );
  dispatch( itemsReceived( response ) );
}
