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

const fetchTags = async ( state ) => {
  const { tags } = getFilter( state );
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
  const response = await fetchTags( state() );
  dispatch( tagsReceived( response ) );
}

export const hydrateItems = () => async ( dispatch, state ) => {
  const response = await fetchItems( {
    ...getFilter( state() ),
    ...getPagination( state() ),
   } );
  dispatch( itemsReceived( response ) );
}

export const goToPreviousPage = () => async ( dispatch, state ) => {
  var { skip, limit } = getPagination( state() );
  skip -= limit;
  if ( skip < 0 ) {
    skip = 0;
  }
  const pagination = { skip, limit };
  const response = await fetchItems( pagination );
  dispatch( setPagination( pagination ) );
  dispatch( itemsReceived( response ) );
}

export const goToNextPage = () => async ( dispatch, state ) => {
  var { skip, limit } = getPagination( state() );
  skip += limit;
  
  const pagination = { skip, limit };
  const response = await fetchItems( pagination );
  dispatch( setPagination( pagination ) );
  dispatch( itemsReceived( response ) );
}
