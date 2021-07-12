import React from 'react';


function filesDropped( event ) {
  event.preventDefault();
  console.log( arguments );

  if ( event.dataTransfer.items ) {
    for ( let i = 0; i < event.dataTransfer.items.length; i++ ) {
      if (event.dataTransfer.items[i].kind === 'file') {
        const file = event.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);
      }
    }
  }
}

function DragDropImporter() {
  return (
    <div className='article importer' >
      <h2 className='title'>Drag & drop a file to import</h2>
      <div 
        className='drop-target'
        onDragOver={ 
          // Prevent the browser from intercepting and opening the file in a tab.
          event => event.preventDefault()
        }
        onDrop={ filesDropped }
      ></div>
    </div> 
  );
}

export default DragDropImporter;
