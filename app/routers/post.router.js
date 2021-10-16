module.exports = function(router)
{
    // Post
    var postController = require('../controllers/post.controller');
    
    //API  1  add_post ok
   router.post('/post/add_post',postController.add_post);
   // get_post 2 ok
   router.post('/post/get_post',postController.get_post);

   //API get_list_posts 3  gần ok
   router.post('/post/get_list_posts',postController.get_list_posts);
     
   //check_new_item 4   ok
  router.post('/post/check_new_item',postController.check_new_item);

   //edit_post 5 ok  ok
   router.put('/post/edit_post',postController.edit_post);

   //delete_post 6  ok
   router.delete('/post/delete_post',postController.delete_post);

   //report_post 7  ok
   router.post('/post/report_post',postController.report_post);
   
   //get_comment 8
   router.post('/post/get_comment',postController.get_comment);


      //git push -u
}