var User = require('../models/user.model');
var Admin = require('../models/admin.model');
var Erro = require('../moduleAll/Erro.moduleAll');

var jwt = require('jsonwebtoken');

exports.getlistuser = function (req, res) {
    //f
    User.get_all(function (data) {
        //   console.log(data);
        res.render('user-list', { title: 'User List1', userData: data });
    });


}
exports.login_admin = function (rep, res) {
    const data = rep.body;
    var nphone = rep.body.phone_admin;
    var password = rep.body.pass_admin;
    if (nphone === null || password === null || nphone === '' || password === '') {
        Erro.code1002();
    }
    else if (nphone.length !== 10 || nphone[0] !== '0') {
        console.log(nphone.length);

        res.send(JSON.stringify({
            Code: 1004,
            Message: 'Parameter value is invalid - Thông báo số điện thoại không đúng định dạng'
        }))
    }
    else {
        if (nphone === password || password.length > 10 || password.length < 6) {
            res.send(JSON.stringify({
                Code: 1004,
                Message: 'Parameter value is invalid - sai định dạng của mật khẩu'
            }))
        }
        Admin.checkPhoneNumber(rep.body.phone_admin, (err, admin) => {
            if (err) {
                Erro.code1001();
            } else {
                if (admin.length !== 0) {
                    Admin.checkPass(rep.body.pass_admin, (err, admin) => {
                        if (err) {
                            Erro.code1001();
                        } else {
                            if (admin.length !== 0) {
                                const accessToken = jwt.sign({
                                    iss: admin[0].phone_admin,
                                    sub: admin[0].pass_user,
                                    iat: new Date().getTime(),
                                    exp: new Date().setDate(new Date().getTime() + 1)
                                }, 'NodejsApiAuthentication')
                                console.log(accessToken);
                                Admin.createToken(rep.body.phone_admin, accessToken, (err, response) => {
                                    if (err) {
                                        Erro.code1001();
                                    } else {
                                        res.send(JSON.stringify({
                                            code: 1000,
                                            message: 'đăng nhập thành công',
                                           // user: admin[0],
                                        }));
                                    }
                                })
                            }
                            else {
                                res.send(JSON.stringify({
                                    Message: 'mat khau sai'
                                }))
                            }
                        }
                    });
                } else {
                    res.send(JSON.stringify({
                        Message: 'acc ko ton tai'
                    }))
                }
            }
        })
    }

}