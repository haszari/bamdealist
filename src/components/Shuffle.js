import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import CasinoIcon from '@material-ui/icons/Casino';

import { listUrl } from '../lib/route-url';

import { setShuffle } from '../store/list/actions';

import store from '../store';



import {
  getFilter,
  getShuffle,
} from '../store/list/selectors';

function Shuffle() {
  const { limit } = useSelector( getShuffle );
  const filter = useSelector( getFilter );
  const history = useHistory();
  const numberInput = useRef();

  const setShuffleLimit = ( limit ) => store.dispatch( setShuffle( { limit } ) );

  return (
    <form onSubmit={ ( e ) => {
      e.preventDefault();
      const url = listUrl( { 
        ...filter,
        shuffle: numberInput.current.value
      } );
      history.push( url );
    } }>
      <CasinoIcon className='icon' />
      <input 
        type="number"
        ref={ numberInput }
        onChange={ e => setShuffleLimit( e.currentTarget.value ) }
        value={ limit } />
    </form>
  );
}

export default Shuffle;
