
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  setPagination,
  setFilterTags,
  setFilterSearch,
  hydrateItems,
  hydrateTags,
} from './store/list/actions';

import {
  setId,
  hydrateArticle,
} from './store/article/actions';

import store from './store';

import Pagination from './components/Pagination';
import TagCloud from './components/TagCloud';
import Items from './components/Items';
import Item from './components/Item';
import Search from './components/Search';

import './App.css';

function useQuery() {
  return new URLSearchParams( useLocation().search );
}

function ArticleView() {
  return (
    <div className='app'>
      <Item />
    </div>
   );
}

function HydratedArticleView() {
  let { id } = useParams();

  useEffect( () => {
    store.dispatch( setId( id ) );
    store.dispatch( hydrateArticle() );
  }, [ id ] );

  return ( <ArticleView /> );
}


function ListView() {
  return (
    <div className='app'>
      <Pagination />
      <TagCloud />
      <Items />
    </div>
   );
}

function HydratedListView() {
  const queryParams = useQuery();
  const tags = queryParams.getAll( 'tag' );
  const skip = queryParams.get( 'skip' ) || 0;
  const limit = queryParams.get( 'limit' ) || 12;
  const shuffle = queryParams.get( 'shuffle' ) || false;
  const search = queryParams.get( 'search' ) || '';

  useEffect( () => {
    store.dispatch( setPagination( { skip, limit, shuffle } ) );
    store.dispatch( setFilterSearch( search ) );
    store.dispatch( setFilterTags( tags ) );
    store.dispatch( hydrateItems() );
    store.dispatch( hydrateTags() );
  }, [ skip, limit, shuffle, tags, search ] );

  return ( <ListView /> );
}

function App() {

  return (
      <Router>
        <Provider store={ store }>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/?search=midi">search midi</Link>
            </li>
            <li>
              <Link to="/?tag=musiclistening&tag=hiphop">musiclistening+hiphop</Link>
            </li>
          </ul>

          <Switch>
            <Route path="/item/:id" children={ 
                <HydratedArticleView />
            } />
            <Route path="/" children={ 
                <>
                  <Search />
                  <HydratedListView />
                </>
            } />
          </Switch>
        </Provider>
      </Router>
  );
}

export default App;
