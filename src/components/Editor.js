import React from 'react';

import {
  BlockEditorProvider,
  BlockList,
  WritingFlow,
  ObserveTyping
} from '@wordpress/block-editor';
import { Popover } from '@wordpress/components';
import { useState } from '@wordpress/element';

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';

import { registerCoreBlocks } from '@wordpress/block-library';
registerCoreBlocks();

function Editor () {
  const [ blocks, updateBlocks ] = useState( [] );

  return (
    <BlockEditorProvider
      value={ blocks }
      onInput={ updateBlocks }
      onChange={ updateBlocks }
    >
      <WritingFlow>
        <ObserveTyping>
          <BlockList />
        </ObserveTyping>
      </WritingFlow>
      <Popover.Slot />
    </BlockEditorProvider>
  );
}

export default Editor;