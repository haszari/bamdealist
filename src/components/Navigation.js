import React from 'react';

import { Link } from 'react-router-dom';

import ApartmentIcon from '@material-ui/icons/Apartment';

import Search from './Search';
import Shuffle from './Shuffle';

function Navigation() {
  return (
    <div className='navigation'>
      <Link to='/'><ApartmentIcon className='icon' /></Link>
      <Search />
      <Shuffle />
    </div>
  );
}

export default Navigation;
