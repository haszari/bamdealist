import * as mdealib from '../mdealib.js';

test( 'imports list items grouped by H1 context', () => {
  const md = `# #fun #drama #conflict

- watch 124
- watch 409

eat chips daringly

# #work #business #commerce

task 1

do a job
  and then some

- get a haircut
- shake a tower
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 7 );

  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- watch 124',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: '- watch 409',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: 'eat chips daringly',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }],
      type: 'listItem',
    } )
  );

  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: 'task 1',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: `do a job
  and then some`,
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[5] ).toEqual(
    expect.objectContaining( {
      content: '- get a haircut',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[6] ).toEqual(
    expect.objectContaining( {
      content: '- shake a tower',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }],
      type: 'listItem',
    } )
  );

} );

test( 'imports list items grouped by H1 context with H3 context', () => {
  const md = `# #fun #drama #conflict

- watch 124

### 20201212

- watch 409

eat chips daringly

# #work #business #commerce

### 20201212

task 1

do a job
  and then some

### 20201213

- get a haircut
- shake a tower
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 7 );

  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- watch 124',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: '- watch 409',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: 'eat chips daringly',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );

  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: 'task 1',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: `do a job
  and then some`,
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[5] ).toEqual(
    expect.objectContaining( {
      content: '- get a haircut',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201213',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[6] ).toEqual(
    expect.objectContaining( {
      content: '- shake a tower',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201213',
      }],
      type: 'listItem',
    } )
  );

} );

test( 'imports list items and article items grouped by H1 context with H3 context', () => {
  const md = `# #fun #drama #conflict

- watch 124

## history
### 20201212
#### played a game of squash.
With Johnson. And I won. Tough competitor.

Afterward we celebrated by eating chips and drinking Fresh Up®.

# #work #business #commerce

### 20201212

task 1

do a job
  and then some

## history


## tasks

### 20201213
- get a haircut

## tasks
- shake a tower
`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 6 );

  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- watch 124',
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: `With Johnson. And I won. Tough competitor.

Afterward we celebrated by eating chips and drinking Fresh Up®.`,
      context: [{
        depth: 1, 
        markdown: '# #fun #drama #conflict',
      }, {
        depth: 2, 
        markdown: '## history',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }, {
        depth: 4, 
        markdown: '#### played a game of squash.',
      }],
      type: 'headingItem',
    } )
  );

  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: 'task 1',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: `do a job
  and then some`,
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 3, 
        markdown: '### 20201212',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: '- get a haircut',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }, {
        depth: 3, 
        markdown: '### 20201213',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[5] ).toEqual(
    expect.objectContaining( {
      content: '- shake a tower',
      context: [{
        depth: 1, 
        markdown: '# #work #business #commerce',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }],
      type: 'listItem',
    } )
  );

} );

