import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { getPagination, getFilter } from '../store/list/selectors';

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
    <div className='toolbar pagination'>
      <Link className='iconbutton previousPage' to={ `/?${ prevPage }` } ><ArrowBackIcon className='icon' /></Link>
      <Link className='iconbutton nextPage' to={ `/?${ nextPage }` } ><ArrowForwardIcon className='icon' /></Link>
    </div>
  );
}

export default Pagination;
