import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import ReactMde from 'react-mde';
import 'react-mde/lib/styles/scss/react-mde-all.scss';

import { getArticle } from '../store/article/selectors';

import markdownRenderer from '../lib/markdown-renderer';


function Editor () {
  const item = useSelector( getArticle );

  // Store the edited item content in local state.
  const [ value, setValue ] = React.useState( false );

  // The item is loaded dynamically after we are mounted; 
  // populate the state after load.
  useEffect( () => {
    if ( item.content && false === value) {
      setValue( item.content );
    }
  }, [ item.content, value ] );

  const save = () => {
    // here we need to persist `value` via rest API
  };

  const [ selectedTab, setSelectedTab ] = React.useState("write");
  return (
      <>
        <button onClick={ save }>Save</button>
        <ReactMde
          value={ value }
          onChange={ setValue }
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