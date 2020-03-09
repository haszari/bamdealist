
import React from 'react';
import { Provider } from 'react-redux';

import store from './store/store';
import { hydrateTags } from './store/actions';

import Tags from './components/Tags';
import './App.css';

// Load our initial state.
store.dispatch( hydrateTags() );

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Tags/>
      </div>
    </Provider>
  );
}

export default App;
