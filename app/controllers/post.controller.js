var Post = require('../models/post.model');
var User = require('../models/user.model');
var Erro = require('../moduleAll/Erro.moduleAll');
var jwt = require('jsonwebtoken');

// 1
exports.add_post = function (req, res) {
  var content = req.body.content_post;
  var token = req.body.token;
  if (content.length >= 200 || content.length == 0 || token.length == 0 || token == undefined || content == undefined) {
    Erro.code1002(res);
  }
  else {
    User.checkToken(token, (err, user) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (user.length == 0) {
          Erro.code1002(res);
        }
        else {
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
          let seconds = date_ob.getSeconds();

          const accessToken = jwt.sign({
            iss: user[0].pass_user,
            sub: user[0].sdt_user,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getTime() + 1)
          }, 'NodejsApiAuthentication')

          var url = user[0].id_user + "/" + "new url";
          var DataNewPost = {
            id_user: user[0].id_user,
            content_post: content,
            url_post: url,
            media: "link media",
            id_list_user_like: "0",
            id_list_user_cm: "0",
            date_create: year + "-" + month + "-" + date + "-" + hours + "-" + minutes,
            // token_post: accessToken,
          }
          Post.AddPost(DataNewPost, function (postb) {
            if (postb == null) {
              Erro.code1001(res);
            }
            else {
              var DataNewPost = {
                id_post: postb.id,
                url_post: postb.url_post
              }
              res.send(JSON.stringify({
                code: 1000,
                message: 'ok',
                data: DataNewPost
              }));
            }
          });
        }
      }
    })
  }
}

//2
exports.get_post = function (req, res) {
  var id_post = req.body.id_post;
  var token = req.body.token;
  // console.log(token);
  Post.CheckPostById(id_post, (err, post) => {
    if (err) {
      Erro.code1001(res);
    } else {

      User.checkToken(token, (err, userchecktoken) => {
        if (err) {
          Erro.code1001(res);
        } else {
          if (userchecktoken.length !== 0) {
            if (post.length !== 0) {
              User.getUserbyID(post[0].id_user, (err, user) => {
                if (err) {
                  Erro.code1001(res);
                }
                else {
                  // console.log("get post test"+user[0].id_user);
                  // console.log(post[0].id);

                  var getauthor = {
                    id: user[0].id_user,
                    name: user[0].name_user,
                    avatar: user[0].linkavatar_user,
                  }
                  var DataGetPost = {
                    id: post[0].id,
                    described: post[0].content,
                    created: post[0].date_create,
                    modified: "No",
                    like: post[0].id_list_user_like,
                    comments: post[0].id_list_user_cm,
                    is_like: "0",
                    author: getauthor,
                    stae: "online",
                    // is_blocked:post.
                    //  can_edit:post.can_edit,
                    //   banned:post.banned,
                    //  can comment:

                  }
                  res.send(JSON.stringify({
                    code: 1000,
                    message: 'ok',
                    data: DataGetPost
                  }));
                }
              })
            }
            else {
              Erro.code9994(res);
            }
          }
          else {
            Erro.code9998(res);
          }
        }
      })
    }
  }
  )
}

//3
exports.get_list_posts = function (req, res) {
  var count = req.body.count;
  var token = req.body.token;
  var index = req.body.index;
  var last_id = req.body.last_id;


  console.log("khi chua vao vòng lặp" + last_id);
  console.log("khi chua vao vòng lặp" + token);

  if (count == '' || index == '' || count == null || index == null || index == undefined || index == undefined) {
    Erro.code1004(res);
  }
  else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {
          Post.get_list_post_id_to_id(last_id, count, (err, listpost) => {
            if (err) {
              Erro.code1001(res);
            } else {
              if (listpost.length !== 0) {
                /*
               var DataGetPost = {
                 id: post[0].id,
                 described: post[0].content,
                 created: post[0].date_create,
                 modified: "No",
                 like: post[0].id_list_user_like,
                 comments: post[0].id_list_user_cm,
                 is_like: "0",
                 author: getauthor,
                 stae: "online",
                 // is_blocked:post,
                 //  can_edit:post.can_edit,
                 //   banned:post.banned,
                 //  can comment:

               }
               */
                // chưa giải quyết được: output,4,5,6,7,8, 9,10,11,12 15
                var newlastindexobj = listpost[listpost.length - 1];
                var newlastindex = newlastindexobj.id + 1;
                if (newlastindex == undefined || newlastindex == null || newlastindex == '') {
                  Erro.code1004(res);
                }
                else {
                  res.send(JSON.stringify({
                    code: '1000',
                    message: 'OK',
                    data: listpost,
                    last_id: newlastindex,
                    new_item: 0,
                    in_campaign: 0,
                    campaign_id: 0,

                  }))
                }
              } else {
                res.send(JSON.stringify({
                  code: '9994',
                  message: 'người dùng có thể kết bạn thêm'
                }));
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
//
exports.check_new_item = function (req, res) {
  var last_id = req.body.last_id;
  var category_id = req.body.category_id;
  console.log(last_id);
  console.log(category_id);
  if (last_id == "" || last_id == null || last_id == undefined) {
    Erro.code1004(res);
  }
  else {
    Post.CheckPostById(last_id, (err, post) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (post.length !== 0) {
          User.getUserbyID(post[0].id_user, (err, user) => {
            if (err) {
              Erro.code1001(res);
            }
            else {
              // console.log("get post test"+user[0].id_user);
              // console.log(post[0].id);
              var getauthor = {
                id: user[0].id_user,
                name: user[0].name_user,
                avatar: user[0].linkavatar_user,
              }
              var DataGetPost = {
                id: post[0].id,
                described: post[0].content,
                created: post[0].date_create,
                modified: "No",
                like: post[0].id_list_user_like,
                comments: post[0].id_list_user_cm,
                is_like: "0",
                author: getauthor,
                stae: "online",
                // is_blocked:post.
                //  can_edit:post.can_edit,
                //   banned:post.banned,
                //  can comment:

              }
              res.send(JSON.stringify({
                code: 1000,
                message: 'ok',
                data: DataGetPost
              }));
            }
          })
        }
        else {
          Erro.code9994(res);
        }
      }
    })
  }
}

// 5
exports.edit_post = function (req, res) {
  var token = req.body.token;
  var id = req.body.id;
  var described = req.body.described;
  var image = req.body.image;
  if (token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  }
  else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {
          if (described.length >= 200 || described == "" || described == null || described == undefined || image.length >= 200 || image == undefined || image == null) {
            Erro.code1002(res);
          }
          else {
            Post.updatePost(id, described, (err, response) => {
              if (err) {
                Erro.code1001(err);
              }
              else {
                res.send(JSON.stringify({
                  code: 1000,
                  message: 'ok',
                  //  data: response
                }))
              }
            })
          }
        } else {
          Erro.code9998(res);
        }
      }
    });
  }
}

exports.delete_post = function (req, res) {
  var id = req.body.id;
  var token = req.body.token;
  if (token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  }
  else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {
          Post.Delete(id, (err, response) => {
            if (err) {
              Erro.code1001(err);
            }
            else {
              if (response.affectedRows != 0) {
                res.send(JSON.stringify({
                  code: 1000,
                  message: 'đã xóa bài viết thành công',
                   data: response
                }))
              }
              else {
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
