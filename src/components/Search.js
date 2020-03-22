import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import SearchIcon from '@material-ui/icons/Search';

import { listUrl } from '../lib/route-url';

import { getFilter } from '../store/list/selectors';

function Search() {
  const filter = useSelector( getFilter );
  const history = useHistory();
  const searchInput = useRef();
  return (
    <form className='search' onSubmit={ ( e ) => {
      e.preventDefault();
      const url = listUrl( { 
        ...filter,
        search: searchInput.current.value
      } );
      history.push( url );
    } }>
      <SearchIcon className='icon' /> 
      <input ref={ searchInput } defaultValue={ filter.search } />
    </form>
  );
}

export default Search;
