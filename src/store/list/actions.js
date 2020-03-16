import { createAction } from '@reduxjs/toolkit';

import {
  getPagination,
  getFilter,
} from './selectors';

import { formatMongoSearchQuery } from '../../lib/mongo-query';
import { apiBase } from '../../lib/api';

export const tagsReceived = createAction( 'list/tagsReceived' );

export const itemsReceived = createAction( 'list/itemsReceived' );

export const setPagination = createAction( 'list/setPagination' );

export const setFilterTags = createAction( 'list/setFilterTags' );

export const setFilterSearch = createAction( 'list/setFilterSearch' );

const fetchTags = async ( { tags = [], search = '' } ) => {
  const mongoQuery = JSON.stringify( formatMongoSearchQuery( tags, search ) );
  const response = await fetch( `${ apiBase }tags?query=${ mongoQuery }` );
  return response.json();
}

const fetchItems = async ( { limit = 1, skip = 0, tags = [], search = '' } ) => {
  const mongoQuery = JSON.stringify( formatMongoSearchQuery( tags, search ) );
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
