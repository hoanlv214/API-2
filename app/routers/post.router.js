module.exports = function(router)
{
    // Post
    var postController = require('../controllers/post.controller');
    //API get_list_posts
    router.get('/post/list',postController.get_list_posts);

    //API  1  add_post
   router.post('/post/add_post',postController.add_post);
   // get_post 
   router.get('/post/get_post',postController.get_post);

   //edit_post
   router.get('/post/edit_post',postController.edit_post);
   //git push -u
   //delete_post
   router.get('/post/delete_post',postController.delete_post);

   //check_new_item
   router.get('/post/check_new_item',postController.check_new_item);
}