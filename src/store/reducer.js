import { createReducer } from '@reduxjs/toolkit';

import * as actions from './actions';

const DEFAULT_STATE = {
  pagination: {
    limit: 12,
    skip: 0,
  },
  items: [
    // title & content are markdown
    //  { _id, title, content, updated, tags }
  ],
  tags: [
    //  { _id, count, tag }
  ], 
};

const reducer = createReducer( DEFAULT_STATE, {
  [ actions.tagsReceived ]: ( state, action ) => {
    state.tags = action.payload;
  },
  [ actions.itemsReceived ]: ( state, action ) => {
    state.items = action.payload;
  },
} );

export default reducer;
