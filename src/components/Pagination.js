import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getPagination, getFilter } from '../store/selectors';

function Pagination() {
  const { skip, limit } = useSelector( getPagination );
  const { tags } = useSelector( getFilter );

  const params = new URLSearchParams();
  tags.forEach( tag => {
    params.append( 'tag', tag );
  } );
  params.set( 'skip', skip + limit );
  const nextPage = params.toString();
  const prev = skip - limit;
  const allowPrev = ( prev > 0 );
  if ( allowPrev ) {  
    params.set( 'skip', Math.max( skip - limit, 0 ) );
  }
  else {
    params.delete( 'skip' );
  }
  const prevPage = params.toString();

  return (
    <div className='pagination'>
      <Link className='previousPage' to={ `/?${ prevPage }` } >Previous</Link>
      <Link className='nextPage' to={ `/?${ nextPage }` } >Next</Link>
    </div>
  );
}

export default Pagination;
