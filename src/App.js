
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom';

import {
  setPagination,
  setFilterTags,
  setFilterSearch,
  setSort,
  setShuffle,
  hydrateItems,
  hydrateTags,
  tagsReceived,
  itemsReceived,
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
import Navigation from './components/Navigation';

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
      <Items />
      <TagCloud />
    </div>
   );
}

function HydratedShuffleView() {
  const queryParams = useQuery();
  const tags = queryParams.getAll( 'tag' );
  const limit = queryParams.get( 'limit' ) || 1;
  const search = queryParams.get( 'search' ) || '';

console.log( 'yep', limit );

  useEffect( () => {
    // clear UI
    store.dispatch( tagsReceived( [] ) );
    store.dispatch( itemsReceived( [] ) );

    store.dispatch( setShuffle( { limit } ) );
    store.dispatch( setFilterSearch( search ) );
    store.dispatch( setFilterTags( tags ) );
    store.dispatch( setSort( 'shuffle' ) );
    store.dispatch( hydrateItems() );
    // clear tags??
    // store.dispatch( hydrateTags() );
  }, [ limit, tags, search ] );

  return ( <ListView /> );
}

function HydratedListView() {
  const queryParams = useQuery();
  const tags = queryParams.getAll( 'tag' );
  const skip = queryParams.get( 'skip' ) || 0;
  const limit = queryParams.get( 'limit' ) || 12;
  const search = queryParams.get( 'search' ) || '';

  useEffect( () => {
    // clear UI
    store.dispatch( tagsReceived( [] ) );
    store.dispatch( itemsReceived( [] ) );

    store.dispatch( setPagination( { skip, limit } ) );
    store.dispatch( setFilterSearch( search ) );
    store.dispatch( setFilterTags( tags ) );
    store.dispatch( setSort( 'sort' ) );
    store.dispatch( hydrateItems() );
    store.dispatch( hydrateTags() );
  }, [ skip, limit, tags, search ] );

  return ( <ListView /> );
}

function App() {

  return (
      <Router>
        <Provider store={ store }>
          <Navigation />

          <Switch>
            <Route path="/item/:id" children={ 
                <HydratedArticleView />
            } />
            <Route path="/lucky" children={ 
                <>
                  <HydratedShuffleView />
                </>
            } />
            <Route path="/" children={ 
                <>
                  <HydratedListView />
                </>
            } />
          </Switch>
        </Provider>
      </Router>
  );
}

export default App;
