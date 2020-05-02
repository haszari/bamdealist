import React from 'react';

import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider,
  BlockList,
  BlockInspector,
  WritingFlow,
  ObserveTyping,
} from '@wordpress/block-editor';
import {
  Popover,
  SlotFillProvider,
  DropZoneProvider,
} from '@wordpress/components';
import { useState } from '@wordpress/element';

import '@wordpress/components/build-style/style.css';
import '@wordpress/block-editor/build-style/style.css';

import { registerCoreBlocks } from '@wordpress/block-library';
registerCoreBlocks();

function Editor () {
  const [ blocks, updateBlocks ] = useState( [] );

  return (
    <SlotFillProvider>
      <DropZoneProvider>
        <BlockEditorProvider
          value={ blocks }
          onInput={ updateBlocks }
          onChange={ updateBlocks }
        >
          <div className="editor-sidebar">
            <BlockInspector />
          </div>
          <div className="editor-styles-wrapper">
            <Popover.Slot name="block-toolbar" />
            <BlockEditorKeyboardShortcuts />
            <WritingFlow>
              <ObserveTyping>
                <BlockList />
              </ObserveTyping>
            </WritingFlow>
          </div>
          <Popover.Slot />
        </BlockEditorProvider>
      </DropZoneProvider>
    </SlotFillProvider>
  );
}

export default Editor;