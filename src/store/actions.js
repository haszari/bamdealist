import { createAction } from '@reduxjs/toolkit';

export const tagsReceived = createAction( 'transport/tagsReceived' );

const fetchTags = async () => {
  const response = await fetch( 'http://localhost:8947/api/v1/tags/' );
  return response.json();
}

export const hydrateTags = () => async dispatch => {
  // todo dispatch a "isLoading" event
  const tags = await fetchTags();
  dispatch( tagsReceived( tags ) );
}
