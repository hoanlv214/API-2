module.exports = function(router)
{
    // User
    var searchController = require('../controllers/search.controller');
    //API get all user
    router.post('/search/addsearch',searchController.addsearch);

   // hoc về sinh token
   //git push -u
   // Post
}