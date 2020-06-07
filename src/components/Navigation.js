import React from 'react';

import { Link } from 'react-router-dom';

import ApartmentIcon from '@material-ui/icons/Apartment';

import Search from './Search';
import Shuffle from './Shuffle';

function Navigation() {
  return (
    <div className='toolbar navigation'>
      <Link className='iconbutton home' to='/'><ApartmentIcon className='icon' /></Link>
      <Search />
      <Shuffle />
    </div>
  );
}

export default Navigation;
