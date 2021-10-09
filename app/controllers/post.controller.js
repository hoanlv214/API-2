var Post = require('../models/post.model');
var User = require('../models/user.model');
var jwt = require('jsonwebtoken');

exports.get_list_posts = function (rep, res) {
  Post.get_list_posts(function (data) {
    if (data == null) {
      res.send(JSON.stringify({
        code: 1001,
        message: 'khong the kết nối với database'
      }));
    }
    else {
      res.send({ result: data });
    }
  });
}
// 1
exports.add_post = function (rep, res) {
  var content = rep.body.content_post;
  var token = rep.body.token;
  if (content.length >= 200 || content.length == 0 || token.length == 0 || token == undefined || content == undefined) {
    res.send(JSON.stringify({
      code: '1002',
      message: 'Parameter is not enought'
    }))
  }
  else {
    User.checkToken(token, (err, user) => {
      if (err) {
        res.send(JSON.stringify({
          code: 1001,
          message: 'khong the kết nối với database'
        }));
      } else {
        if (user.length == 0) {
          res.send(JSON.stringify({
            code: '1002',
            message: 'Parameter is not enought'
          }))
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
              res.send(JSON.stringify({
                code: 1001,
                message: 'khong the kết nối với database'
              }));
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
exports.get_post = function (rep, res) {
  var id_post = rep.body.id_post;
  var token = rep.body.token;
  console.log(id_post);
  Post.CheckIdPost(id_post, (err, post) => {
    if (err) {
      res.send(JSON.stringify({
        code: 1001,
        message: 'khong the kết nối với database'
      }));
    } else {

      User.checkToken(token, (err, userchecktoken) => {
        if (err) {
          res.send(JSON.stringify({
            code: 1001,
            message: 'khong the kết nối với database'
          }));
        } else {
          if (userchecktoken.length !== 0) {
            if (post.length !== 0) {
              User.getUserbyID(post[0].id_user, (err, user) => {
                if (err) {
                  res.send(JSON.stringify({
                    code: 1001,
                    message: 'khong the kết nối với database'
                  }));
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
              res.send(JSON.stringify({
                code: 9994,
                message: 'No Data or end of list data'
              }));
            }
          }
          else {
            res.send(JSON.stringify({
              code: 9998,
              message: 'Token is invalid'
            }));
          }
        }
      })
    }
  }
  )
}
exports.check_new_item = function (rep, res) {
  var id_user = rep.body.id_user;
  var token = rep.body.token;

}
exports.edit_post = function (rep, res) {
  var id_user = rep.body.id_user;
  var token = rep.body.token;

}

exports.delete_post = function (rep, res) {
  var id_user = rep.body.id_user;
  var token = rep.body.token;

}



