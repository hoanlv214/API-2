var User = require('../models/user.model');
var Admin = require('../models/admin.model');
var Erro = require('../moduleAll/Erro.moduleAll');

var jwt = require('jsonwebtoken');

exports.getlistuser = function (req, res) {
    //f
    User.get_all(function (data) {
        //   console.log(data);
     //   res.render('index', { title: 'User List1', userData: data });
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

//Tuan 5
/*
1. Người quản trị thực thi request API và truyền đúng các 
giá trị tham số đầu vào
Kết quả trả về: 1000|OK – Trả về giá trị cho request 
get_analyst_result và điều hướng đến trang hiển thị

2. Người quản trị thực thi request API nhưng role_key đã 
hết phiên làm việc và người quản trị không phải là 
superadmin
Kết quả trả về : Thông báo hết hạn role_key và điều 
hướng về trang chủ default_user

3. Người quản trị đang thực thi request api thì bị mất mạng.
Kết quả trả về: Hiển thị trên màn hình “ Đang chờ đợi 
mạng “ và thiết lập thời gian chờ cho một cổng listener 
đợi response từ server trả về lúc có mạng trở lại thay vì 
phải reload page
4. Người quản trị thực hiện request nhưng đã bị tước quyền 
truy cập
Kết quả trả về: Thông báo về email cho email của người 
quản trị, thông báo có lỗi sai khác

*/
exports.set_user_state = function (rep, res) {
    var token = rep.body.token;
    var role_key = rep.body.role_key;
    var user_id = rep.body.user_id;
    var state = rep.body.state;
    if (state > 1 || state < 0 || token == null || token.length == 0 || token == undefined || token == "" || role_key == "" || user_id <= 0 || user_id == undefined || user_id == null) {

    }
    else {
        Admin.checkToken(token, (err, admin) => {
            if (err) {
                Erro.code1001();
            } else {
                if (admin.length !== 0) {
                    User.getUserbyID(user_id, (err, user) => {
                        if (err) {
                            Erro.code1001();
                        } else {
                            if (user.length !== 0) {
                                 //cat dat trang thai cho user
                            }
                            else {
                                Erro.code9996(res);
                            }
                        }
                    })
                } else {
                    //token
                }
            }
        })
    }
}
//  delete_user
/*
API này nhằm mục đích để người quản lý có thể tiến hành xóa 
hoàn toàn tài khoản đó của người dùng:
Phương thức: POST
Input: token, role_key, user_id, 
Kết quả đầu ra: 1000|Ok – Nếu server đã chỉnh sửa thông tin 
trạng thái đó của người dùng
Nếu xảy ra lỗi thì hiển thị lỗi và đưa ra thông báo tương ứng
 
1. Người quản trị thực thi request API và truyền đúng các 
giá trị tham số đầu vào
Kết quả trả về: 1000|OK – Trả về giá trị cho request 
get_analyst_result và điều hướng đến trang hiển thị

2. Người quản trị thực thi request API nhưng role_key đã 
hết phiên làm việc và người quản trị không phải là 
superadmin
Kết quả trả về : Thông báo hết hạn role_key và điều 
hướng về trang chủ default_user

3. Người quản trị đang thực thi request api thì bị mất mạng.
Kết quả trả về: Hiển thị trên màn hình “ Đang chờ đợi 
mạng “ và thiết lập thời gian chờ cho một cổng listener 
đợi response từ server trả về lúc có mạng trở lại thay vì 
phải reload page

4. Người quản trị thực hiện request nhưng đã bị tước quyền 
truy cập
Kết quả trả về: Thông báo về email cho email của người 
quản trị, thông báo có lỗi sai khác.

5. Người quản trị thực thi request, tuy nhiên người dùng đã 
bị xóa trước đó
Kết quả trả về: Thông báo người dùng không tồn tại và 
không hiển thị gì thêm.

6. Người quản trị thực hiện request nhưng người dùng đã 
được nâng quyền
Kết quả trả về: Thông báo “Bạn không có quyền xóa tài 
khoản này”.

*/
exports.delete_user = function (rep, res) {
    var token = rep.body.token;
    var role_key = rep.body.role_key;
    var user_id = rep.body.user_id;
    if ( token == null || token.length == 0 || token == undefined || token == "" || role_key == "" || user_id <= 0 || user_id == undefined || user_id == null) {

    }
    else {

    }
}
/*
API này nhằm mục đích để người quản lý có thể tiến hành lấy 
thông tin cơ bản tài khoản đó của người dùng:
Phương thức: POST
Input: token, role_key, user_id, 
Kết quả đầu ra: 1000|Ok – Nếu server đã chỉnh sửa thông tin 
trạng thái đó của người dùng
Nếu xảy ra lỗi thì hiển thị lỗi và đưa ra thông báo tương ứng

1. Người quản trị thực thi request API và truyền đúng các 
giá trị tham số đầu vào
Kết quả trả về: 1000|OK – Trả về giá trị cho request 
get_analyst_result và điều hướng đến trang hiển thị
2. Người quản trị thực thi request API nhưng role_key đã 
hết phiên làm việc và người quản trị không phải là 
superadmin
Kết quả trả về : Thông báo hết hạn role_key và điều 
hướng về trang chủ default_user

3. Người quản trị đang thực thi request api thì bị mất mạng.
Kết quả trả về: Hiển thị trên màn hình “ Đang chờ đợi 
mạng “ và thiết lập thời gian chờ cho một cổng listener 
đợi response từ server trả về lúc có mạng trở lại thay vì 
phải reload page
4. Người quản trị thực hiện request nhưng đã bị tước quyền 
truy cập
Kết quả trả về: Thông báo về email cho email của người 
quản trị, thông báo có lỗi sai khác.

5. Người quản trị thực thi request, tuy nhiên người dùng đã 
bị xóa trước đó
Kết quả trả về: Thông báo người dùng không tồn tại và 
không hiển thị gì thêm.
6. Người quản trị thực hiện request nhưng người dùng đã 
được nâng quyền
Kết quả trả về: Thông báo “Bạn không có quyền xem 
thông tin tài khoản này”.

*/
exports.get_basic_user_info = function (rep, res) {
    var token = rep.body.token;
    var role_key = rep.body.role_key;
    var user_id = rep.body.user_id;
    if ( token == null || token.length == 0 || token == undefined || token == "" || role_key == "" || user_id <= 0 || user_id == undefined || user_id == null) {

    }
    else {

    }
}