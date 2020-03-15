import { createReducer } from '@reduxjs/toolkit';

import * as actions from './actions';

const DEFAULT_STATE = {
  id: '',
  article: {},
};

const reducer = createReducer( DEFAULT_STATE, {
  [ actions.articleReceived ]: ( state, action ) => {
    state.article = action.payload;
  },
  [ actions.setId ]: ( state, action ) => {
    state.id = action.payload;
  },
} );

export default reducer;
