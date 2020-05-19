import _ from 'lodash'; 

export const DEFAULT_PAGINATION = {
   itemsPerPage: 8,
   skipToItem: 0
};

export function formatMongoSearchQuery( args ) {
   const { tags: tagsArray, excludeTags, search: textSearch, startDate, endDate } = args;
   let query = {}, clauses = [];

   let startDateNum = Date.parse( startDate );
   let endDateNum = Date.parse( endDate );
   if ( startDate && _.isFinite( startDateNum ) ) {
      clauses.push( {
         originated: {
            $gte: new Date( startDateNum )
         }
      } );
   }
   if ( endDate && _.isFinite( endDateNum ) ) {
      clauses.push({
         originated: {
            $lte: new Date( endDateNum )
         }
      });
   }
   
   if ( tagsArray && tagsArray.length ) {
      clauses.push({
         lowerCaseTags: {
            $all: _.map( tagsArray, tag => tag.toLowerCase() )
         }
      });
   }
   
   if ( excludeTags && excludeTags.length ) {
      clauses.push({
         lowerCaseTags: {
            $nin: _.map( excludeTags, tag => tag.toLowerCase() )
         }
      });
   }
   
   if ( textSearch ) {
      clauses.push( {
         "$text": {
            $search: textSearch
         }
      } );
   }

   if ( clauses.length > 0 )
      query.$and = clauses;
   
   return query;
};
