module.exports = function(router)
{
  
    var friendController = require('../controllers/friend.controller');

   router.post('/friend/get_user_friends',friendController.get_user_friends);

    //Get_requested_friend
    router.post('/friend/get_requested_friend',friendController.get_requested_friend);

   // tuan 6
   router.post('/friend/set_request_friend',friendController.set_request_friend);

   //git push -u
   // Post
}