import * as mdealib from '../mdealib.js';

// multiple h1 context tests todo
// tasks and history h2 present, under different h1 sections
// history then tasks, under different h1 sections
// as above, no h2s, all lists
// as above, occasional history section, correctly default to list


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

