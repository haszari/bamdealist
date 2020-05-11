import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ReactMde from 'react-mde';
import 'react-mde/lib/styles/scss/react-mde-all.scss';

import { getArticle } from '../store/article/selectors';
import {
  persistArticle,
} from '../store/article/actions';
import store from '../store';

import markdownRenderer from '../lib/markdown-renderer';


function Editor () {
  const item = useSelector( getArticle );

  // Store the edited item content in local state.
  const [ content, setContent ] = React.useState( false );

  // The item is loaded dynamically after we are mounted; 
  // populate the state after load.
  useEffect( () => {
    if ( item.content && false === content) {
      setContent( item.content );
    }
  }, [ item.content, content ] );

  const save = () => {
    store.dispatch( persistArticle( { id: item._id, content } ) );
  };

  const [ selectedTab, setSelectedTab ] = React.useState("write");
  return (
      <>
        <button onClick={ save }>Save</button>
        <ReactMde
          value={ content }
          onChange={ setContent }
          selectedTab={ selectedTab }
          onTabChange={ setSelectedTab }
          generateMarkdownPreview={ markdown =>
            Promise.resolve( markdownRenderer( markdown ) )
          }
        />
      </>
  );
}

export default Editor;