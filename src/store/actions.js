import { createAction } from '@reduxjs/toolkit';

import {
  getPagination,
  getFilter,
} from '../store/selectors';

import { formatMongoSearchQuery } from '../lib/mongo-query';

export const tagsReceived = createAction( 'transport/tagsReceived' );

export const itemsReceived = createAction( 'transport/itemsReceived' );

export const setPagination = createAction( 'transport/setPagination' );

export const setFilterTags = createAction( 'transport/setFilterTags' );

const apiBase = 'http://localhost:8947/api/v1/';

const fetchTags = async ( { tags = [] } ) => {
  const mongoQuery = JSON.stringify( formatMongoSearchQuery( tags ) );
  const response = await fetch( `${ apiBase }tags?query=${ mongoQuery }` );
  return response.json();
}

const fetchItems = async ( { limit = 1, skip = 0, tags = [] } ) => {
  const mongoQuery = JSON.stringify( formatMongoSearchQuery( tags ) );
  const response = await fetch( `${ apiBase }Item/?limit=${ limit }&skip=${ skip }&sort={"originated":-1}&query=${ mongoQuery }` );
  return response.json();
}

export const hydrateTags = () => async ( dispatch, state ) => {
  const current = state();
  const filter = getFilter( current );
  const response = await fetchTags( filter );
  dispatch( tagsReceived( response ) );
}

export const hydrateItems = () => async ( dispatch, state ) => {
  const current = state();
  const response = await fetchItems( {
    ...getFilter( current ),
    ...getPagination( current ),
   } );
  dispatch( itemsReceived( response ) );
}

export const goToPreviousPage = () => async ( dispatch, state ) => {
  const current = state();
  var { skip, limit } = getPagination( current );
  skip -= limit;
  if ( skip < 0 ) {
    skip = 0;
  }
  const filter = getFilter( current );
  const response = await fetchItems( { skip, limit, ...filter } );
  dispatch( setPagination( { skip, limit } ) );
  dispatch( itemsReceived( response ) );
}

export const goToNextPage = () => async ( dispatch, state ) => {
  const current = state();
  var { skip, limit } = getPagination( current );
  skip += limit;

  const filter = getFilter( current );
  const response = await fetchItems( { skip, limit, ...filter } );
  dispatch( setPagination( { skip, limit } ) );
  dispatch( itemsReceived( response ) );
}
