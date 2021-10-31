
module.exports = function (router) {

 var adminController = require('../controllers/admin.controller');
    router.get('/admin/getlistuser', adminController.getlistuser);

    router.post('/admin/login',adminController.login_admin);
 
   //router.post('/admin/logout',adminController.logout_admin);

   // tuan 4 thieu
   //chat

   // => 3 cai nay lam dễ mà ko hiểu làm gì
 //  7. API xác nhận quyền admin
 //9. API cấp quyền 
//10. API lấy thông tin phân tích
}