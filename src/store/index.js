import list from './list/reducer';
import article from './article/reducer';

import { configureStore } from '@reduxjs/toolkit';

const store = configureStore( { 
  reducer: {
    list,
    article,
  } 
} );

export default store;
