import React from 'react';

import randomPseudoword from '../lib/random-pseudoword';

function RandomWurd() {
  const title = randomPseudoword( { capitalize: true } );
  const word = randomPseudoword( { capitalize: false } );

  return (
    <div className='article wurd' >
      <h2 className='title'>{ title }</h2>
      <div className='content'>{ word }</div>
    </div> 
  );
}

export default RandomWurd;
