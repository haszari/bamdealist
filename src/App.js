
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import store from './store/store';
import {
  setPagination,
  setFilterTags,
  hydrateItems,
  hydrateTags,
} from './store/actions';

import Pagination from './components/Pagination';
import TagCloud from './components/TagCloud';
import Items from './components/Items';
import './App.css';

function useQuery() {
  return new URLSearchParams( useLocation().search );
}

function ListView() {
  return (
    <div className='app'>
      <Pagination />
      <Items />
      <TagCloud />
    </div>
   );
}

function HydratedListView() {
  const queryParams = useQuery();
  const tags = queryParams.getAll( 'tag' );
  const skip = queryParams.get( 'skip' ) || 0;

  useEffect( () => {
    store.dispatch( setPagination( { skip } ) );
    store.dispatch( setFilterTags( tags ) );
    store.dispatch( hydrateItems() );
    store.dispatch( hydrateTags() );
  }, [ skip, tags ] );

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
              <Link to="/?tag=musiclistening">musiclistening</Link>
            </li>
            <li>
              <Link to="/?tag=musiclistening&tag=hiphop">musiclistening+hiphop</Link>
            </li>
          </ul>

          <Switch>
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
