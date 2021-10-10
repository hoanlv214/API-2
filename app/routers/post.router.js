module.exports = function(router)
{
    // Post
    var postController = require('../controllers/post.controller');
    
    //API  1  add_post ok
   router.post('/post/add_post',postController.add_post);
   // get_post 2 ok
   router.get('/post/get_post',postController.get_post);

   //API get_list_posts 3
   router.get('/post/list',postController.get_list_posts);

   //edit_post 4
   router.get('/post/edit_post',postController.edit_post);

   //delete_post 5
   router.get('/post/delete_post',postController.delete_post);

   //check_new_item 6
   router.get('/post/check_new_item',postController.check_new_item);

      //git push -u
}