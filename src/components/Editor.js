import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import DoneIcon from '@material-ui/icons/Done';

import { useDebouncedCallback } from 'use-debounce';

import ReactMde from 'react-mde';
import 'react-mde/lib/styles/scss/react-mde-all.scss';

import { getArticle, isDirty, isSaving } from '../store/article/selectors';
import {
  persistArticle,
  setDirty, 
} from '../store/article/actions';
import store from '../store';

import markdownRenderer from '../lib/markdown-renderer';
import { articleUrl } from '../lib/route-url';

function Editor () {
  const item = useSelector( getArticle );
  const dirty = useSelector( isDirty );
  const saving = useSelector( isSaving );

  // Store the edited item content in local state.
  const [ title, setTitle ] = React.useState( false );
  const [ content, setContent ] = React.useState( false );
  const [ tags, setTags ] = React.useState( false );

  // The item is loaded dynamically after we are mounted; 
  // populate the state after load.
  useEffect( () => {
    if ( item.hasOwnProperty( 'title' ) && false === title ) {
      setTitle( item.title );
    }
    if ( item.hasOwnProperty( 'content' ) && false === content ) {
      setContent( item.content );
    }
    if ( item.hasOwnProperty( 'userTags' ) && false === tags ) {
      setTags( item.userTags );
    }
  }, [ item, title, content, tags ] );

  const saveToServer = () => {
    store.dispatch( persistArticle( { id: item._id, title, content, userTags: tags } ) );
  };

  const debounceTimeoutMs = 1000;
  const [ debouncedSave ] = useDebouncedCallback(
    saveToServer,
    debounceTimeoutMs
  );

  // When any content field changes we need to do two things:
  // - save new value in local state, using a setState func
  // - trigger a debounced update
  const onChange = ( setStateFunc, value ) => {
    store.dispatch( setDirty( true ) );
    setStateFunc( value );
    debouncedSave(); 
  }

  const [ selectedTab, setSelectedTab ] = React.useState("write");
  return (
    <>
    <div className='editor'>
      <ReactMde
        classes={{ reactMde: 'editor-title' }}
        value={ title }
        disablePreview={ true }
        toolbarCommands={ [] }
        minEditorHeight={ 58 }
        maxEditorHeight={ 58 }
        onChange={ onChange.bind( null, setTitle ) }
      />
      <ReactMde
        classes={{ reactMde: 'editor-content' }}
        value={ content }
        onChange={ onChange.bind( null, setContent ) }
        selectedTab={ selectedTab }
        onTabChange={ setSelectedTab }
        generateMarkdownPreview={ markdown =>
          Promise.resolve( markdownRenderer( markdown ) )
        }
      />
      <textarea 
        className='editor-tags'
        value={ tags }
        onChange={ event => onChange( setTags, event.target.value ) }
      />
    </div>
      <div className='toolbar article-toolbar'>
        <Button 
          variant='contained' 
          color='primary'
          startIcon={ <DoneIcon /> }
          component={ Link } 
          to={ articleUrl( item._id ) } 
          disabled={ dirty || saving }
        >
          Done
        </Button>
      </div>
    </>
  );
}

export default Editor;