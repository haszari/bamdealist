
import React from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";

import store from './store/store';
import {
  setFilterTags,
  hydrateItems,
  hydrateTags,
} from './store/actions';

import Pagination from './components/Pagination';
import TagCloud from './components/TagCloud';
import Items from './components/Items';
import './App.css';


function ListView() {
  return (
    <div className='app'>
      <Pagination />
      <Items />
      <TagCloud />
    </div>
   );
}

function HydratedTagView() {
  const { tags: plusDelimitedTags } = useParams();
  const tags = plusDelimitedTags.split( '+' );

  store.dispatch( setFilterTags( tags ) );
  store.dispatch( hydrateItems() );
  store.dispatch( hydrateTags() );

  return ( <ListView /> );
}

function HydratedListView() {
  store.dispatch( hydrateItems() );
  store.dispatch( hydrateTags() );
  return ( <ListView /> );
}


function App() {

  return (
    <Provider store={ store }>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/find/tags/musiclistening">musiclistening</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/find/tags/:tags" children={ 
              <HydratedTagView />
            } />
            <Route path="/" children={ 
              <HydratedListView /> 
            } />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
