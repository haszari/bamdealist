import { createReducer } from '@reduxjs/toolkit';

import * as actions from './actions';

const DEFAULT_STATE = {
  // set to a route url to trigger a redirect
  redirect: '',
};

const reducer = createReducer( DEFAULT_STATE, {
  [ actions.redirect ]: ( state, action ) => {
    state.redirect = action.payload;
  },
} );

export default reducer;
