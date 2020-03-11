
import React from 'react';
import { Provider } from 'react-redux';

import store from './store/store';
import { hydrateItems, hydrateTags } from './store/actions';

import Pagination from './components/Pagination';
import TagCloud from './components/TagCloud';
import Items from './components/Items';
import './App.css';

// Load our initial state.
store.dispatch( hydrateItems() );
store.dispatch( hydrateTags() );

function App() {
  return (
    <Provider store={store}>
      <div className='app'>
        <Pagination />
        <Items />
        <TagCloud />
      </div>
    </Provider>
  );
}

export default App;
