import { createReducer } from '@reduxjs/toolkit';

import * as actions from './actions';

const DEFAULT_STATE = {
  id: '',
  article: {},
  isSaving: false,
  isDirty: false,
};

const reducer = createReducer( DEFAULT_STATE, {
  [ actions.articleReceived ]: ( state, action ) => {
    state.article = action.payload;
  },
  [ actions.setId ]: ( state, action ) => {
    state.id = action.payload;
  },
  [ actions.setSaving ]: ( state, action ) => {
    state.isSaving = action.payload;
  },
  [ actions.setDirty ]: ( state, action ) => {
    state.isDirty = action.payload;
  },
} );

export default reducer;
