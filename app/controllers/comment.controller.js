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
                  var block;
                  User.checkIsBlock(post[0].id_user, (err, bocked1) => {
                    if (err) {
                      Erro.code1001();
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
                              Erro.code1001();
                            }
                            else {
                              if (comment.length != 0) {
                                User.getUserbyID(comment[0].id_user, (err, user) => {
                                  if (err) {
                                    Erro.code1001();
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
  
                    res.send(JSON.stringify({
                        code: 1000,
                        message: 'OK',
                       
                      }));
                      
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