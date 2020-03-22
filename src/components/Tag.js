import React from 'react';
import { Link } from 'react-router-dom';


function Tag( { fontSize, label, href } ) {
  const styles = { fontSize };
  return (
    <Link to={ href } >
      <div className='tag' style={ styles } >{ label }</div> 
    </Link>
  );
}

export default Tag;
