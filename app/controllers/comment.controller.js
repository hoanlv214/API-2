var Post = require('../models/post.model');
var User = require('../models/user.model');
var Comment = require('../models/comment.model');
var Erro = require('../moduleAll/Erro.moduleAll');


/*Tham số: token, id (của bài viết), index, count (để lấy danh 
sách theo từng phần), trong trang trước không nói rõ nhưng 
API này có thêm tham số token


// ko xử lý được
Người dùng truyền đúng các thông tin. Nhưng bài viết đã 
bị khóa (do vi phạm tiêu chuẩn cộng đồng hoặc bị hạn 
chế tại quốc gia) trước khi gửi yêu cầu (trong lúc gửi yêu 
cầu xem bình luận thì bài viết vẫn có tồn tại).
Kết quả mong đợi: mã lỗi 1010 và bài viết bị biến mất 
trong trang hiện tại. Nếu là trang chủ thì ứng dụng sẽ xóa 
bài viết đó. Nếu là trang cá nhân thì có thể xóa bài viết đó 
hoặc làm mới lại trang cá nhân (tùy thuộc tình huống).




Người dùng truyền đúng các thông số. Nhưng hệ thống 
chỉ còn số bình luận ít hơn số count.
Kết quả mong đợi: ứng dụng cần hiển thị các bình luận 
còn lại, nhưng chắc chắn không còn bình luận nào thêm 
nữa, hệ thống sẽ không có câu “Tải thêm các bình luận...”

ko xử lý được
8. Người dùng truyền đúng các thông tin. Nhưng người 
dùng đã bị khóa tài khoản (do hệ thống khóa đi mất).
Kết quả mong đợi: ứng dụng sẽ phải đẩy người dùng sang 
trang đăng nhập. 


*/

exports.get_comment = function (req, res) {
  var token = req.body.token;
  var id = req.body.id;
  var index = req.body.index;
  var count = req.body.count;
  if (count <= 0 || count == "" || count == undefined || count == null || index < 0 || index == "" || index == undefined || index == null || token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.codeNoNet(res);
      } else {
        if (userchecktoken.length !== 0) {
          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.codeNoNet(res);
            } else {
              if (post.length !== 0) {

                User.checkIsBlock(post[0].id_user, (err, bocked1) => {
                  if (err) {
                    Erro.code1001(res);
                  }
                  else {
                    var block;
                    console.log(bocked1);
                    if (bocked1.length != 0) {
                      console.log(bocked1[0].id_blockB + "+" + userchecktoken[0].id_user);
                      if (bocked1[0].id_blockB == userchecktoken[0].id_user) {
                        block = 1;
                      }
                      else {
                        block = 0;
                        console.log("block binh luân" + block);
                      }
                    }
                    else {
                      block = 0;
                    }

                    var listidcomment = post[0].id_list_user_cm.split(",");
                    console.log("day là list id comment" + listidcomment);
                    var listcomment = [];
                    if (listidcomment.length - 1 > 0) {

                      var dem = index - 1;
                      console.log("day la tong so comment " + listidcomment.length - 1);
                      var block;
                      var a = 0;
                      for (let i = index - 1; i <= listidcomment.length - 1; i++) {
                        console.log("day la id coment" + listidcomment[i]);
                        Post.CheckCommnetByID(listidcomment[i], (err, comment) => {
                          if (err) {
                            Erro.code1001(res);
                          }
                          else {
                            if (comment.length != 0) {
                              User.getUserbyID(comment[0].id_user, (err, user) => {
                                if (err) {
                                  Erro.code1001(res);
                                } else {

                                  var getauthor = {
                                    id: user[0].id_user,
                                    name: user[0].name_user,
                                    avatar: user[0].linkavatar_user,
                                  }

                                  var datacomment = {
                                    id: comment[0].id,
                                    commnet: comment[0].content_cm,
                                    created: comment[0].createdate_cm,
                                    poster: getauthor
                                  }
                                  listcomment.push(datacomment);
                                  dem++;
                                  console.log("dem bang bao nhieu day" + dem);
                                  if (dem == listidcomment.length - 1 && a == 0 || dem == count && a == 0) {
                                    res.send(JSON.stringify({
                                      code: 1000,
                                      message: 'OK',
                                      data: listcomment,
                                      is_blocked: block
                                    }));
                                    a = 1;
                                  }

                                }
                              })
                            }
                          }
                        })
                      }
                    } else {
                      res.send(JSON.stringify({
                        code: 1000,
                        message: 'OK',
                        data: listcomment,
                        is_blocked: block
                      }));
                    }

                  }
                })
              }
              else {
                Erro.code9992(res);
              }
            }
          });
        }
        else {
          Erro.code9998(res);
        }
      }
    })
  }
}

exports.add_comment = function (req, res) {

  var token = req.body.token;
  var id = req.body.id;
  var comment = req.body.comment;
  var index = req.body.index;
  var count = req.body.count;

  if (count <= 0 || count == "" || count == undefined || count == null || index < 0 || index == "" || index == undefined || index == null || token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.codeNoNet(res);
      } else {
        if (userchecktoken.length !== 0) {

          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.codeNoNet(res);
            } else {
              if (post.length !== 0) {
                var block;
                User.checkIsBlock(post[0].id_user, (err, bocked1) => {
                  if (err) {
                    Erro.code1001(res);
                  }
                  else {

                    console.log(bocked1);
                    if (bocked1.length != 0) {
                      console.log(bocked1[0].id_blockB + "+" + userchecktoken[0].id_user);
                      if (bocked1[0].id_blockB == userchecktoken[0].id_user) {
                        block = 1;
                      }
                      else {
                        block = 0;
                        console.log("block binh luân" + block);
                      }
                    }
                    else {
                      block = 0;
                    }
                  }
                })

                let date_ob = new Date();
                // current date
                // adjust 0 before single digit date
                let date = ("0" + date_ob.getDate()).slice(-2);
                // current month
                let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                // current year
                let year = date_ob.getFullYear();
                // current hours
                let hours = date_ob.getHours();
                // current minutes
                let minutes = date_ob.getMinutes();
                // current seconds
                var addnewcomment = {
                  content_cm: comment,
                  id_user: userchecktoken[0].id_user,
                  createdate_cm: year + "-" + month + "-" + date + "-" + hours + "-" + minutes,
                }

                Comment.AddComment(addnewcomment, function (Newcomment) {
                  if (Newcomment == null) {
                    Erro.code1001(res);
                  }
                  else {
                    if (Newcomment.length !== 0) {
                      console.log(Newcomment);
                      var getlistidcomment = post[0].id_list_user_cm;
                      if (getlistidcomment == "0") {
                        getlistidcomment = "";
                      }
                      var listidcommnetnew = getlistidcomment + Newcomment.id + ",";

                      Post.updateComment(id, listidcommnetnew, (err, Postnewcomment) => {
                        if (err) {
                          Erro.code1001(res);
                        }
                        else {
                          // lỗi new comment
                          Post.CheckPostById(id, (err, post) => {
                            if (err) {
                              Erro.codeNoNet(res);
                            } else {
                              if (post.length !== 0) {
                                var listidcomment = post[0].id_list_user_cm.split(",");
                                console.log("day là list id comment" + listidcomment);
                                var listcomment = [];
                                if (listidcomment.length - 1 > 0) {

                                  var dem = index - 1;
                                  console.log("day la tong so comment " + listidcomment.length - 1);

                                  var a = 0;
                                  for (let i = index - 1; i <= listidcomment.length - 1; i++) {
                                    console.log("day la id coment" + listidcomment[i]);

                                    Post.CheckCommnetByID(listidcomment[i], (err, comment) => {
                                      if (err) {
                                        Erro.code1001(res);
                                      }
                                      else {
                                        if (comment.length != 0) {
                                          User.getUserbyID(comment[0].id_user, (err, user) => {
                                            if (err) {
                                              Erro.code1001(res);
                                            } else {

                                              var getauthor = {
                                                id: user[0].id_user,
                                                name: user[0].name_user,
                                                avatar: user[0].linkavatar_user,
                                              }

                                              var datacomment = {
                                                id: comment[0].id,
                                                commnet: comment[0].content_cm,
                                                created: comment[0].createdate_cm,
                                                poster: getauthor
                                              }
                                              listcomment.push(datacomment);
                                              dem++;
                                              console.log("dem bang bao nhieu day" + dem);
                                              if (dem == listidcomment.length - 1 && a == 0 || dem == count && a == 0) {
                                                res.send(JSON.stringify({
                                                  code: 1000,
                                                  message: 'OK',
                                                  data: listcomment,
                                                  is_blocked: block
                                                }));
                                                a = 1;
                                              }

                                            }
                                          })
                                        }
                                      }
                                    })
                                  }
                                } else {
                                  res.send(JSON.stringify({
                                    code: 1000,
                                    message: 'OK',
                                    data: listcomment,
                                    is_blocked: block
                                  }));
                                }
                              } else {
                                Erro.code9992(res);
                              }
                            }
                          })
                        }
                      })
                    }
                    else {
                      Erro.codeNoNet(res);
                    }
                  }
                })
              } else {
                Erro.code9992(res);
              }
            }
          })
        }
        else {
          Erro.code9998(res);
        }
      }
    })

  }
}

exports.delete_comment = function (req, res) {

  var token = req.body.token;
  var id = req.body.id;
  var idcomment = req.body.id_com;

  if (token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null || idcomment == undefined || idcomment == "" || idcomment == null || id <= 0) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.codeNoNet(res);
      } else {
        if (userchecktoken.length !== 0) {
          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.codeNoNet(res);
            } else {
              if (post.length !== 0) {
                var arrayidcomment = post[0].id_list_user_cm.split(",");
                //  console.log(arrayidcomment.toString());
                for (let i = 0; i < arrayidcomment.length; i++) {
                  //    console.log(arrayidcomment[i]);
                  if (arrayidcomment[i] == idcomment) {
                    //   console.log("da tim thay id can xoa" + arrayidcomment[i]);
                    arrayidcomment.splice(i, 1);
                  }
                }
                console.log(arrayidcomment.toString());
                Post.updateComment(id, arrayidcomment.toString(), (err, response) => {
                  if (err) {
                    Erro.code1001(res);
                  }
                  else {
                    Comment.DeleteComment(idcomment, (err, response) => {
                      if (err) {
                        Erro.code1001(res);
                      }
                      else {
                        if (response.affectedRows != 0) {
                          res.send(JSON.stringify({
                            code: 1000,
                            message: 'ok'
                          }))

                        }
                        else {
                          Erro.codeNoNet(res);
                        }
                      }
                    })
                  }
                })
              } else {
                Erro.code9992(res);
              }
            }
          })
        } else {
          Erro.code9998(res);
        }
      }
    })
  }
}
/*
3. Người dùng truyền đúng mã phiên đăng nhập, id bài viết 
và các tham số khác phù hợp nhưng nội dung không phù 
hợp để đăng (ví dụ ảnh giết hại động vật).
Kết quả mong đợi: mã lỗi 1010, ứng dụng hiển thị ra các 
thông tin cần thiết.

4. Người dùng truyền đúng mã phiên đăng nhập, id bài viết 
và các tham số khác phù hợp nhưng tài khoản bị khóa.
Kết quả mong đợi: mã lỗi 9995, ứng dụng hiển thị ra các 
thông tin cần thiết và đẩy người dùng sang trang đăng 
nhập

// da lam xong  y 5
5. Người dùng truyền đúng mã phiên đăng nhập, id và các 
tham số khác phù hợp nhưng tài khoản bị block.
Kết quả mong đợi: Thông báo tài khoản đã bị chặn.

6. Người dùng truyền đúng mã phiên đăng nhập, id bài viết 
và các tham số khác phù hợp nhưng tài khoản bị khóa.
Kết quả mong đợi: mã lỗi 9995, ứng dụng hiển thị ra các 
thông tin cần thiết và đẩy người dùng sang trang đăng 
nhập

*/


exports.edit_comment = function (req, res) {

  var token = req.body.token;
  var id = req.body.id;
  var idcomment = req.body.id_com;
  var comment = req.body.comment;
  if (comment == "" || comment.length == 0 || comment == null || comment == undefined || token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null || idcomment == undefined || idcomment == "" || idcomment == null || id <= 0) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.codeNoNet(res);
      } else {
        if (userchecktoken.length !== 0) {
          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.codeNoNet(res);
            } else {
              if (post.length !== 0) {
                var block;
                User.checkIsBlock(post[0].id_user, (err, bocked1) => {
                  if (err) {
                    Erro.code1001(res);
                  }
                  else {

                    console.log(bocked1);
                    if (bocked1.length != 0) {
                      console.log(bocked1[0].id_blockB + "+" + userchecktoken[0].id_user);
                      if (bocked1[0].id_blockB == userchecktoken[0].id_user) {
                        block = 1;
                      }
                      else {
                        block = 0;
                        console.log("block binh luân" + block);
                      }
                    }
                    else {
                      block = 0;
                    }
                  }
                })
                if (block == 0) {

                  Comment.updateComment(idcomment, comment, (err, response) => {
                    if (err) {
                      Erro.code1001(res);
                    }
                    else {
                      res.send(JSON.stringify({
                        code: 1000,
                        message: 'ok',
                        //  data: response
                      }))
                    }
                  })

                } else {
                  res.send(JSON.stringify({
                    message: 'tài khoản đã bị chặn'
                  }));
                }
              } else {
                Erro.code9992(res);
              }
            }
          })
        } else {
          Erro.code9998(res);
        }
      }
    })
  }
}

