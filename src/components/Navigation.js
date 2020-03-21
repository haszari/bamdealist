import React from 'react';

import { Link } from 'react-router-dom';

import Search from './Search';
import Shuffle from './Shuffle';

function Navigation() {
  return (
    <div>
      <Link to='/'>Home</Link>
      <Search />
      <Shuffle />
    </div>
  );
}

export default Navigation;
