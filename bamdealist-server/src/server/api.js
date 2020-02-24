// Dictionary of APIs.
// Key is api path, value is middleware request handler.
// (AHEM, all GETs for now.)
// (This is not used; all our api routes are implemented by the db router.)

module.exports = {
   'bam': function (req, res) {
      res.send({ 
         bam: true,
         value: Math.random() 
      });
   }
};