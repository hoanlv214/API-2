module.exports = function(router)
{ 
    // Post
    var commentController = require('../controllers/comment.controller');
    
     //get_comment 8
   router.post('/comment/get_comment',commentController.get_comment);

     // add comment
   router.post('/comment/add_comment',commentController.add_comment);

   
}