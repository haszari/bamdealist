import { createAction } from '@reduxjs/toolkit';

export const tagsReceived = createAction( 'transport/tagsReceived' );

export const itemsReceived = createAction( 'transport/itemsReceived' );

const apiBase = 'http://localhost:8947/api/v1/';

const fetchTags = async () => {
  const response = await fetch( `${ apiBase }tags` );
  return response.json();
}

const fetchItems = async () => {
  const response = await fetch( `${ apiBase }Item/?limit=10&sort={"originated":-1}` );
  return response.json();
}

export const hydrateTags = () => async dispatch => {
  // todo dispatch a "isLoading" event
  const response = await fetchTags();
  dispatch( tagsReceived( response ) );
}

export const hydrateItems = () => async dispatch => {
  // todo dispatch a "isLoading" event
  const response = await fetchItems();
  dispatch( itemsReceived( response ) );
}
