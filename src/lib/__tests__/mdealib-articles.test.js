import * as mdealib from '../mdealib.js';

test( 'imports article items with no H3 context', () => {
  const md = `# #h1tag #h1concept

## history
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
        depth: 4,
        markdown: '#### article 1',
      }],
      type: 'headingItem',
    } )
  );
} );

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
