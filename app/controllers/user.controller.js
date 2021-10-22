var User = require('../models/user.model');
var Erro = require('../moduleAll/Erro.moduleAll');
var jwt = require('jsonwebtoken');

exports.get_list = function (rep, res) {

  User.get_all(function (data) {
    res.send({ result: data });
  });

}



exports.add_user = function (rep, res) {
  var phonenumber = rep.body.sdt_user;
  var password = rep.body.pass_user;
  if (phonenumber === null || password === null || phonenumber === '' || password === '' || phonenumber === undefined || password === undefined) {

    res.send(JSON.stringify({
      Code: 1002,
      Message: 'sai định dạng của số điện thoại hoặc mật khẩu'
    }))

  }
  else if (phonenumber.length !== 10 || phonenumber[0] !== '0') {
    console.log(phonenumber.length);

    res.send(JSON.stringify({
      Code: 1004,
      Message: 'Parameter value is invalid - Thông báo số điện thoại không đúng định dạng'
    }))
  } else {

    if (phonenumber === password || password.length > 10 || password.length < 6) {
      res.send(JSON.stringify({
        Code: 1004,
        Message: 'Parameter value is invalid - sai định dạng của mật khẩu'
      }))
    }
    else {
      var data = rep.body
      User.checkPhoneNumber(rep.body.sdt_user, (err, user) => {
        if (err) {
          res.send(JSON.stringify({
            Code: 1001,
            Message: 'khong the kết nối với database'
          }));
        } else {
          if (user.length !== 0) {
            res.send(JSON.stringify({
              Code: 9996,
              Message: 'tài khoản đã được đăng ký',
              // Data:user[0].id_user

            }));
          } else {
            // console.log(data);
            User.Create(data, function (response) {

              res.send(JSON.stringify({
                Code: 1000,
                Message: 'dang ky thanh cong',
                Data: response

              }))

            });

          }

        }
      })
    }
  }
}

// login user   còn thiếu nếu nếu sai tên tài khoản nó cũng ko cho vào
exports.login_user = function (rep, res) {
  const data = rep.body;
  var phonenumber = rep.body.sdt_user;
  var password = rep.body.pass_user;
  if (phonenumber === null || password === null || phonenumber === '' || password === '') {
    Erro.code1002();
  }
  else if (phonenumber.length !== 10 || phonenumber[0] !== '0') {
    console.log(phonenumber.length);

    res.send(JSON.stringify({
      Code: 1004,
      Message: 'Parameter value is invalid - Thông báo số điện thoại không đúng định dạng'
    }))
  }
  else {
    if (phonenumber === password || password.length > 10 || password.length < 6) {
      res.send(JSON.stringify({
        Code: 1004,
        Message: 'Parameter value is invalid - sai định dạng của mật khẩu'
      }))
    }
    else {
      console.log(rep.body.sdt_user)
      User.checkPhoneNumber(rep.body.sdt_user, (err, user) => {

        if (err) {
        Erro.code1001();
        } else {
          if (user.length !== 0) {
            const accessToken = jwt.sign({
              iss: user[0].pass_user,
              sub: user[0].sdt_user,
              iat: new Date().getTime(),
              exp: new Date().setDate(new Date().getTime() + 1)
            }, 'NodejsApiAuthentication')
            console.log(rep.body.sdt_user);
            User.createToken(rep.body.sdt_user, accessToken, (err, response) => {
              console.log("check token with phomenumber" + rep.body.sdt_user);
              if (err) {
                Erro.code1001();
              } else {
                if (user[0].pass_user == password) {

                  console.log(rep.body.sdt_user)
                  User.checkPhoneNumber(rep.body.sdt_user, (err, userlogin) => {

                    if (err) {
                     Erro.code1001();
                    } else {
                      res.send(JSON.stringify({
                        code: 1000,
                        message: 'đăng nhập thành công',
                        user: userlogin[0],
                      }));
                    }
                  })

                }
                else {
                  res.send(JSON.stringify({
                    code: 1004,
                    message: 'Mật khẩu không đúng'
                  }));
                }
              }
            })

          } else {
            res.send(JSON.stringify({
              Code: 9995,
              Message: ' Is Not Validated - số điện thoại chưa đăng ký'
            }));
          }
        }
      })
    }
  }
}
//api logout_user
exports.logout_user = function (rep, res) {
  //const data = rep.body;
  var token = rep.body.token;
  console.log("da lay duoc token" + rep.body.token);
  User.checkToken(token, (err, user) => {
    if (err) {
      res.send(JSON.stringify({
        Code: 1001,
        Message: 'khong the kết nối với database'
      }));
    } else {
      if (user.length !== 0) {
        User.createToken(user[0].sdt_user, "", (err, response) => {
          console.log("check token with phomenumber" + rep.body.sdt_user);
          if (err) {
            res.send(JSON.stringify({
              code: '1001',
              message: 'Can not connect to DB'
            }))
          } else {
            res.send(JSON.stringify({
              Code: 1000,
              Message: 'ok đăng xuất thành công',
              //Data: user[0],
              // Token: accessToken
            }));
          }
        })
      }
      else {
        res.send(JSON.stringify({
          Code: "node cotde",
          Message: 'Phiên đăng nhập đã hết hạn',
          // Token: accessToken
        }));
      }

    }
  })
}

// body-parser
// sigin
/*
exports.add_user = function(rep,res){
    // chuyển data xuống thành mmodel để nó cho
    // vào database
    //req là nhận về dữ lữ từ giao diện form
  var data=rep.body;
  console.log(data);
  User.Create(data,function(response){
     res.send({result:response});
    });
}
*/
// add user


