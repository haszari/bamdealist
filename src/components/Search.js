import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { listUrl } from '../lib/route-url';

import { getFilter } from '../store/list/selectors';

function Search() {
  const filter = useSelector( getFilter );
  const history = useHistory();
  const searchInput = useRef();
  return (
    <form onSubmit={ ( e ) => {
      e.preventDefault();
      const url = listUrl( { 
        ...filter,
        search: searchInput.current.value
      } );
      history.push( url );
    } }>
      <input type="search" placeholder='search' ref={ searchInput } value={ filter.text }/>
    </form>
  );
}

export default Search;
