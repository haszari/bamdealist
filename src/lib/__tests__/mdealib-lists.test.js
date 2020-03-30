import * as mdealib from '../mdealib.js';

test( 'imports naked list items', () => {
  const md = `# #h1tag #h1concept

item 1

item 2

item 3 with nested stuff
  this is nested
      and this too
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 3 );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: 'item 2',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: `item 3 with nested stuff
  this is nested
      and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
} );

test( 'imports naked bullet point items', () => {
  const md = `# #h1tag #h1concept

- item 1
- item with nested stuff
    this is nested
  -and this too
- another item

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 3 );
  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- item 1',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: `- item with nested stuff
    this is nested
  -and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
} );


test( 'imports naked mixed list items and bullet points', () => {
  const md = `# #h1tag #h1concept

- item 1

inserted item with some cool info

- item with nested stuff
  this is nested
  and this too
- another item

a dangler on the end with
  - some nested
  stuff

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 5 );
  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- item 1',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: 'inserted item with some cool info',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: `- item with nested stuff
  this is nested
  and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: '- another item',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: `a dangler on the end with
  - some nested
  stuff`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
} );

test( 'imports list items with H2 ## tasks in the middle', () => {
  const md = `# #h1tag #h1concept
            
item 1
      
item 2

## tasks

item 3 with nested stuff
  this is nested
  and this too
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 3 );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: 'item 2',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: `item 3 with nested stuff
  this is nested
  and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
} );

test( 'imports bullet point items under H2 ## tasks', () => {
  const md = `# #h1tag #h1concept

## tasks

- item 1
- item with nested stuff
  this is nested
    and this too
- another item

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 3 );
  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- item 1',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: `- item with nested stuff
  this is nested
    and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: '- another item',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
} );


test( 'imports mixed list items and bullet point under H2 ## tasks', () => {
  const md = `# #h1tag #h1concept

## tasks

bananas

inserted item with some cool info

- item with nested stuff
  this is nested
  and this too
- another item

a dangler on the end with
  - some nested
  stuff

- last item

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 6 );
  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: 'bananas',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: 'inserted item with some cool info',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: `- item with nested stuff
  this is nested
  and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: '- another item',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: `a dangler on the end with
  - some nested
  stuff`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
  expect( imported[5] ).toEqual(
    expect.objectContaining( {
      content: '- last item',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
    );
} );


test( 'imports list items with H2 ## tasks in the middle and H3 context', () => {
  const md = `# #h1tag #h1concept
            
item 1
      
### 20200222 banana

item 2

## tasks

item 3 with nested stuff
  this is nested
  and this too
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 3 );
  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: 'item 1',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: 'item 2',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 3, 
        markdown: '### 20200222 banana',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: `item 3 with nested stuff
  this is nested
  and this too`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }
      // H3 context is reset by H2 ## tasks
      ],
      type: 'listItem',
    } )
  );
} );


