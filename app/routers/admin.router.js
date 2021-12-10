
module.exports = function (router) {

  var adminController = require('../controllers/admin.controller');

  // tuan 4 thieu
  //chat

  // => 3 cai nay lam dễ mà ko hiểu làm gì
  //  7. API xác nhận quyền admin
  //9. API cấp quyền 
  //10. API lấy thông tin phân tích
  router.get('/admin/getlistuser', adminController.getlistuser);

  router.post('/admin/login', adminController.login_admin);


  // tuan 5
   router.post('/admin/set_user_state',adminController.set_user_state);
   router.post('/admin/delete_user',adminController.delete_user);
   router.post('/admin/get_basic_user_info',adminController.get_basic_user_info);
}