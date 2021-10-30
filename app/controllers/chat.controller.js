
var User = require('../models/user.model');
exports.getchat = function (req, res) {
  //f
  User.get_all(function (data) {
 //   console.log(data);
    res.render('user-list', { title: 'User List1', userData: data });
  });
}