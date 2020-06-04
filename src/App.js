
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
  useParams,
} from 'react-router-dom';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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
import RandomWurd from './components/RandomWurd';
import Navigation from './components/Navigation';
import Editor from './components/Editor';


import './style/App.scss';

const theme = createMuiTheme( {
  typography: {
    fontFamily: [ 'Roboto', 'Helvetica', 'Arial', 'sans-serif' ],
    button: {
      textTransform: 'none',
    }
  },
} );


function useQuery() {
  return new URLSearchParams( useLocation().search );
}

function HydratedEditorView() {
  let { id } = useParams();

  useEffect( () => {
    store.dispatch( setId( id ) );
    store.dispatch( hydrateArticle() );
  }, [ id ] );

  return (
    <div className='app editor'>
      <Editor />
    </div>
  );
 }


function RandomWurdView() {
  return (
    <div className='app'>
      <RandomWurd />
    </div>
   );
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
      <TagCloud />
      <Items />
      <Pagination />
    </div>
   );
}

function HydratedShuffleView() {
  const queryParams = useQuery();
  const tags = queryParams.getAll( 'tag' );
  const limit = queryParams.get( 'limit' ) || 1;
  const search = queryParams.get( 'search' ) || '';

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
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigation />

          <Switch>
            <Route path="/wurd" children={ 
              <RandomWurdView />
            } />
            <Route path="/item/:id" children={ 
              <HydratedArticleView />
            } />
            <Route path="/edit/:id" children={ 
              <HydratedEditorView />
            } />
            <Route path="/lucky" children={ 
              <HydratedShuffleView />
            } />
            <Route path="/" children={ 
              <HydratedListView />
            } />
          </Switch>
        </ThemeProvider>
      </Provider>
    </Router>
  );
}

export default App;
