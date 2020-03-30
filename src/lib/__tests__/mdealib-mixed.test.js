import * as mdealib from '../mdealib.js';

test( 'imports mixed lists and articles', () => {
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

## tasks

- task 1
- task 2
  nested

### 20200223

- task other

## history

#### article 4
More stuff!

- including
- article
- list

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 7 );

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
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: `More stuff!

- including
- article
- list`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## history',
      }, {
        // note this H3 is picked up within the article
        depth: 3, 
        markdown: '### 20200223',
      }, 
      // and it obliterates the actual article title
      // this is not ideal .. 
      // {
      //   depth: 4,
      //   markdown: '#### article 2',
      // }
      ],
      type: 'headingItem',
    } )
  );
  expect( imported[2] ).toEqual(
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
        markdown: '### 20200223',
      }, {
        depth: 4,
        markdown: '#### article 3',
      }],
      type: 'headingItem',
    } )
  );
  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: `- task 1`,
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
      content: `- task 2
  nested`,
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
      content: `- task other`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## tasks',
      }, {
        depth: 3, 
        markdown: '### 20200223',
      }],
      type: 'listItem',
    } )
  );
} );


test( 'imports mixed lists and articles, tasks all implicit', () => {
  const md = `# #h1tag #h1concept

- task 1
- task 2
  nested

### 20200223

- task other

### 20200322 banana apple orange

Sentence task.

Paragraph #task. With #multiple sentences.

A short sentence.
   with some nested 
  - things

## history

### 20200406

#### article
More stuff!

In an article.

`;

  const imported = mdealib.importMarkdownDiary( md );
  expect( imported ).toHaveLength( 7 );

  expect( imported[0] ).toEqual(
    expect.objectContaining( {
      content: '- task 1',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[1] ).toEqual(
    expect.objectContaining( {
      content: `- task 2
  nested`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[2] ).toEqual(
    expect.objectContaining( {
      content: '- task other',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 3, 
        markdown: '### 20200223',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[3] ).toEqual(
    expect.objectContaining( {
      content: 'Sentence task.',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 3, 
        markdown: '### 20200322 banana apple orange',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[4] ).toEqual(
    expect.objectContaining( {
      content: 'Paragraph #task. With #multiple sentences.',
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 3, 
        markdown: '### 20200322 banana apple orange',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[5] ).toEqual(
    expect.objectContaining( {
      content: `A short sentence.
   with some nested 
  - things`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 3, 
        markdown: '### 20200322 banana apple orange',
      }],
      type: 'listItem',
    } )
  );
  expect( imported[6] ).toEqual(
    expect.objectContaining( {
      content: `More stuff!

In an article.`,
      context: [{
        depth: 1, 
        markdown: '# #h1tag #h1concept',
      }, {
        depth: 2, 
        markdown: '## history',
      }, {
        depth: 3, 
        markdown: '### 20200406',
      }, {
        depth: 4, 
        markdown: '#### article',
      }],
      type: 'headingItem',
    } )
  );


} );