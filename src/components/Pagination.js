import React from 'react';
import { useDispatch } from 'react-redux';

import { goToPreviousPage, goToNextPage } from '../store/actions';

function Pagination() {
  const dispatch = useDispatch();

  return (
    <div className='pagination'>
      <button className='previousPage' onClick={ () => dispatch( goToPreviousPage() ) } >Previous</button>
      <button className='nextPage' onClick={ () => dispatch( goToNextPage() ) } >Next</button>
    </div>
  );
}

export default Pagination;
