
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

import listStore from './store/list/store';
import {
  setPagination,
  setFilterTags,
  setFilterSearch,
  hydrateItems,
  hydrateTags,
} from './store/list/actions';

import articleStore from './store/article/store';
import {
  setId,
  hydrateArticle,
} from './store/article/actions';

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
    articleStore.dispatch( setId( id ) );
    articleStore.dispatch( hydrateArticle() );
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
  const search = queryParams.get( 'search' ) || '';

  useEffect( () => {
    listStore.dispatch( setPagination( { skip } ) );
    listStore.dispatch( setFilterSearch( search ) );
    listStore.dispatch( setFilterTags( tags ) );
    listStore.dispatch( hydrateItems() );
    listStore.dispatch( hydrateTags() );
  }, [ skip, tags, search ] );

  return ( <ListView /> );
}

function App() {

  return (
      <Router>
        <div>
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
              <Provider store={ articleStore }>
                <HydratedArticleView />
              </Provider>
            } />
            <Route path="/" children={ 
              <Provider store={ listStore }>
                <Search />
                <HydratedListView />
              </Provider>
            } />
          </Switch>
        </div>
      </Router>
  );
}

export default App;
