import * as mdealib from '../mdealib.js';

test( 'empty input produces no items', () => {
   expect(
      mdealib.importMarkdownDiary( '' )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( '   ' )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( '# #h1tag #h1concept   ' )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( `# #h1tag #h1concept   


` )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( `# #h1tag #h1concept   

## history

` )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( `# #h1tag #h1concept   

## tasks

` )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( `# #h1tag #h1concept   

## tasks

## history

` )
   ).toEqual( [ ] );

   expect(
      mdealib.importMarkdownDiary( `# #h1tag #h1concept   

## history

### 20200401

` )
   ).toEqual( [ ] );
} );


