import React, { useState, useEffect } from 'react';
import Tags from './components/Tags';
import './App.css';

function App() {
  const [ tags, setTags ] = useState( [] );

  // const loadTags = useCallback( () => {
  // const loadTags = () => {
  //   fetch( 'http://localhost:8947/api/v1/tags' ).then( (response) => {
  //     return response.json();
  //     // console.log( response );
  //   } ).then( ( data ) => {
  //     console.log( data );
  //     setTags( data );
  //   } );
  // };
  // }, [ ] );


  useEffect ( () => {
    fetch( 'http://localhost:8947/api/v1/tags' ).then( (response) => {
      return response.json();
      // console.log( response );
    } ).then( ( data ) => {
      console.log( data );
      setTags( data );
    } );
  }, [] );

  return (
    <div className="App">
      <Tags tags={ tags } />
    </div>
  );
}

export default App;
