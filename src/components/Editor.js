import React from 'react';

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

import markdownRenderer from '../lib/markdown-renderer';


function Editor () {
  const [value, setValue] = React.useState("**Hello BAM!!!**");
  const [selectedTab, setSelectedTab] = React.useState("write");
  return (
      <ReactMde
        value={value}
        onChange={setValue}
        selectedTab={selectedTab}
        onTabChange={setSelectedTab}
        generateMarkdownPreview={ markdown =>
          Promise.resolve( markdownRenderer( markdown ) )
        }
      />      
  );
}

export default Editor;