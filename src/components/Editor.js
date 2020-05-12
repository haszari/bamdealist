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
  const [ title, setTitle ] = React.useState( false );
  const [ content, setContent ] = React.useState( false );
  const [ tags, setTags ] = React.useState( false );

  // The item is loaded dynamically after we are mounted; 
  // populate the state after load.
  useEffect( () => {
    if ( item.title && false === title ) {
      setTitle( item.title );
    }
    if ( item.content && false === content ) {
      setContent( item.content );
    }
    if ( item.userTags && false === tags ) {
      setTags( item.userTags );
    }
  }, [ item, title, content, tags ] );

  const save = () => {
    store.dispatch( persistArticle( { id: item._id, title, content, userTags: tags } ) );
  };

  const [ selectedTab, setSelectedTab ] = React.useState("write");
  return (
      <>
        <ReactMde
          classes={{ reactMde: 'editor-title' }}
          value={ title }
          disablePreview={ true }
          toolbarCommands={ [] }
          minEditorHeight={ 58 }
          maxEditorHeight={ 58 }
          onChange={ setTitle }
        />
        <ReactMde
          classes={{ reactMde: 'editor-content' }}
          value={ content }
          onChange={ setContent }
          selectedTab={ selectedTab }
          onTabChange={ setSelectedTab }
          generateMarkdownPreview={ markdown =>
            Promise.resolve( markdownRenderer( markdown ) )
          }
        />
        <textarea 
          className='editor-tags'
          value={ tags }
          onChange={ event => setTags( event.target.value ) }
        />
        <button onClick={ save }>Save</button>
      </>
  );
}

export default Editor;