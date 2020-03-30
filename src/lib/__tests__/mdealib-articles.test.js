import * as mdealib from '../mdealib.js';


// article tests todo 
// - import article items under ## history 
// - import article items under ## history with h3 context
// - import naked list items with h3 context

test( 'imports article items with H3 context', () => {
  const md = `# #h1tag #h1concept

## history
### 20200222 banana

#### article 1
content

stuff.

#### article 2 
More stuff!

- including
- article
- list

### 20200223

#### article 3
content

stuff.

#### article 4
More stuff!

- including
- article
- list

`;

    const imported = mdealib.importMarkdownDiary( md );
    expect( imported ).toHaveLength( 4 );

    expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: `content

stuff.`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## history',
      }, {
        depth: 3, 
        markdown: '### 20200222 banana',
      }, {
        depth: 4,
        markdown: '#### article 1',
      }],
      type: 'headingItem',
    } )
  );
} );
