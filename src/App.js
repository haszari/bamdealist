
import React from 'react';
import { Provider } from 'react-redux';

import store from './store/store';
import { hydrateItems, hydrateTags } from './store/actions';

import Tags from './components/Tags';
import Items from './components/Items';
import './App.css';

// Load our initial state.
store.dispatch( hydrateItems() );
store.dispatch( hydrateTags() );

function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <Items />
        <Tags />
      </div>
    </Provider>
  );
}

export default App;
