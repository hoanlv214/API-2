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
          Erro.code9998(res);
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
/*
??? can_comment: ng?????i ch??? b??i vi???t ???? kh??a t??nh n??ng b??nh 
lu???n cho to??n b??
*/
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
              var can_edit;
              var isblocked;
              if (userchecktoken[0].id_user == post[0].id_user) {
                can_edit = "can edit"
                isblocked = "not blocked"
              } else {
                can_edit = "can't edit"
                //post[0].id_user user ????ng b??i vi???t
                //userchecktoken[0].id_user user ??ang xem b??i vi???t
                User.checkIsBlock(post[0].id_user, (err, usercheckblock) => {
                  if (err) {
                    Erro.code1001(res);
                  } else {

                    if (usercheckblock.length != 0) {
                      // console.log(usercheckblock[0].id_blockB + "+" + userchecktoken[0].id_user)

                      if (usercheckblock[0].id_blockB == userchecktoken[0].id_user) {
                        isblocked = "is blocked"
                        console.log(isblocked);
                      }
                    }
                    else {
                      isblocked = "not blocked"
                    }
                  }
                })
              }

              User.getUserbyID(post[0].id_user, (err, user) => {
                if (err) {
                  Erro.code1001(res);
                }
                else {
                  var getauthor = {
                    id: user[0].id_user,
                    name: user[0].name_user,
                    avatar: user[0].linkavatar_user,
                  }

                  var DataGetPost = {
                    id: post[0].id,
                    described: post[0].content_post,
                    created: post[0].date_create,
                    modified: "No",
                    like: post[0].id_list_user_like.split(",").length - 1,
                    comments: post[0].id_list_user_cm.split(",").length - 1,
                    is_like: "0",
                    author: getauthor,
                    stae: "online",
                    is_blocked: isblocked,
                    can_edit: can_edit,
                    //  can comment: can coomement;
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

  if (count == '' || index == '' || count == null || index == null || index == undefined || index == undefined) {
    Erro.code1004(res);
  }
  else {

    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {
          let iduserdangxem = userchecktoken[0].id_user;

          Post.get_list_post_id_to_id(index, count, (err, listpost) => {
            if (err) {
              Erro.code1001(res);
            } else {
              if (listpost.length !== 0) {
                var idcheckcuoipost;
                Post.get_list_posts((alllistpost) => {
                  console.log("all list lengt" + alllistpost.length);
                  idcheckcuoipost = alllistpost[alllistpost.length - 1].id;
                  console.log("id bai viet cuoi cung la" + idcheckcuoipost);
                })
                var alldtPost = [];
                let ok = 0;

                for (let i = 0; i < listpost.length; i++) {

                  User.getUserbyID(listpost[i].id_user, (err, user) => {
                    if (err) {
                      Erro.code1001(res);
                    }
                    else {

                      var can_edit;
                      var isblocked = "not blocked";
                      if (iduserdangxem == user[0].id_user) {
                        can_edit = "can edit"
                      }
                      else {
                        can_edit = "can't edit"
                        //post[0].id_user user ????ng b??i vi???t
                        //userchecktoken[0].id_user user ??ang xem b??i vi???t
                        User.checkIsBlock(listpost[i].id_user, (err, usercheckblock) => {
                          if (err) {
                            Erro.code1001(res);
                          } else {
                            if (usercheckblock.length != 0) {
                              console.log(usercheckblock[0].id_blockB + "+" + userchecktoken[0].id_user)
                              if (usercheckblock[0].id_blockB == userchecktoken[0].id_user) {
                                isblocked = "is blocked"
                                console.log(isblocked);
                              }
                            }
                            else {

                              isblocked = "not blocked"
                            }
                          }
                        })

                      }
                      var getauthor = {
                        id: user[0].id_user,
                        name: user[0].name_user,
                        avatar: user[0].linkavatar_user,
                      }
                      var DataGetPost = {
                        id: listpost[i].id,
                        described: listpost[i].content_post,
                        created: listpost[i].date_create,
                        modified: "No",
                        like: listpost[i].id_list_user_like.split(",").length - 1,
                        comments: listpost[i].id_list_user_cm.split(",").length - 1,
                        is_like: "0",
                        author: getauthor,
                        stae: "online",
                        is_blocked: isblocked,
                        can_edit: can_edit,
                        //  can comment: can coomement;
                      }
                      //  console.log(DataGetPost);
                      alldtPost.push(DataGetPost);
                      ok++;
                      if (ok == listpost.length) {
                        var newlastindexobj = listpost[listpost.length - 1];
                        var newlastindex = newlastindexobj.id + 1;
                        if (newlastindex == undefined || newlastindex == null || newlastindex == '') {
                          Erro.code1004(res);
                        }
                        else {
                          var newitem = idcheckcuoipost - newlastindexobj.id;
                          console.log("so b??i viet moi hi???n th??? " + newitem)
                          res.send(JSON.stringify({
                            code: '1000',
                            message: 'OK',
                            data: alldtPost,
                            last_id: newlastindex,
                            new_item: newitem,
                            in_campaign: 0,
                            campaign_id: 0,
                          }))
                        }
                      }
                    }
                  });

                }

              } else {
                res.send(JSON.stringify({
                  code: '9994',
                  message: 'ng?????i d??ng c?? th??? k???t b???n th??m'
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
  if (category_id == "" || category_id == null || category_id == undefined) {
    category_id = 0;
  }
  if (last_id == "" || last_id == null || last_id == undefined) {
    Erro.code1004(res);
  }
  else {
    Post.get_list_post_id_to_id(last_id, category_id, (err, listpost) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (listpost.length !== 0) {

          var alldtPost = [];
          let ok = 0;
          for (let i = 0; i < listpost.length; i++) {


            User.getUserbyID(listpost[i].id_user, (err, user) => {
              if (err) {
                Erro.code1001(res);
              }
              else {
                var getauthor = {
                  id: user[0].id_user,
                  name: user[0].name_user,
                  avatar: user[0].linkavatar_user,
                }

                var DataGetPost = {
                  id: listpost[i].id,
                  described: listpost[i].content_post,
                  created: listpost[i].date_create,
                  modified: "No",
                  like: listpost[i].id_list_user_like.split(",").length - 1,
                  comments: listpost[i].id_list_user_cm.split(",").length - 1,
                  is_like: "0",
                  author: getauthor,
                  stae: "online",
                  is_blocked: "not block",
                  can_edit: "can edit ",
                  //  can comment: can coomement;
                }
                //  console.log(DataGetPost);
                alldtPost.push(DataGetPost);
                ok++;
                if (ok == listpost.length) {
                  res.send(JSON.stringify({
                    code: '1000',
                    message: 'OK',
                    data: alldtPost,
                  }))
                }
              }
            });

          }
        } else {
          res.send(JSON.stringify({
            code: '9994',
            message: 'ng?????i d??ng c?? th??? k???t b???n th??m'
          }));
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
            Post.CheckPostById(id, (err, post) => {
              if (err) {
                Erro.code1001();
              } else {
                if (post.length != 0) {
                  if (post[0].id_user == userchecktoken[0].id_user) {
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

                  } else {

                    res.send(JSON.stringify({
                      code: 9995,
                      message: 'B???n kh??ng b??i l?? ch??? b??i vi???t n??n kh??ng ???????c edit'
                    }));

                  }

                } else {
                  Erro.code9992();
                }

              }
            })
            // if(userchecktoken[0].id_user==)
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
                  message: '???? x??a b??i vi???t th??nh c??ng',
                  data: userchecktoken
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

/*

- c??i n??y ko  bi???t gi???i quy???t
Nh??ng b??i vi???t ???? 
b??? kh??a (do vi ph???m ti??u chu???n c???ng ?????ng ho???c b??? h???n 
ch??? t???i qu???c gia) tr?????c khi g???i b??o c??o (trong l??c vi???t b??o 
c??o v???n c?? t???n t???i)
K???t qu??? mong ?????i: 1010 | b??i vi???t b??? bi???n m???t trong trang 
hi???n t???i. N???u l?? trang ch??? th?? ???ng d???ng s??? x??a b??i vi???t ????. 


*/
exports.report_post = function (req, res) {
  var token = req.body.token;
  var id = req.body.id;
  var subject = req.body.subject;
  var details = req.body.details;
  console.log(subject);
  if (subject < 0 || details == "" || details == undefined || details == null || token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {

          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.code1001(res);
            } else {
              if (post.length !== 0) {
                res.send(JSON.stringify({
                  code: 1000,
                  message: 'B??i vi???t ??ang ???????c xem x??t'
                }));
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
3. Ng?????i d??ng truy???n ????ng c??c th??ng tin. Nh??ng b??i vi???t ???? 
b??? kh??a (do vi ph???m ti??u chu???n c???ng ?????ng ho???c b??? h???n 
ch??? t???i qu???c gia) tr?????c khi g???i b??o c??o (trong l??c vi???t b??o 
c??o v???n c?? t???n t???i).
K???t qu??? mong ?????i: m?? l???i 1010 v?? b??i vi???t b??? bi???n m???t 
trong trang hi???n t???i. N???u l?? trang ch??? th?? ???ng d???ng s??? x??a 
b??i vi???t ????. N???u l?? trang c?? nh??n th?? c?? th??? x??a b??i vi???t ???? 
ho???c l??m m???i l???i trang c?? nh??n (t??y thu???c t??nh hu???ng).

4. Ng?????i d??ng truy???n ????ng c??c th??ng tin. Nh??ng ng?????i 
d??ng ???? b??? kh??a t??i kho???n (do h??? th???ng kh??a ??i m???t).
K???t qu??? mong ?????i: ???ng d???ng s??? ph???i ?????y ng?????i d??ng sang 
trang ????ng nh???p. nh???p
*/

exports.adlike = function (req, res) {
  var token = req.body.token;
  var id = req.body.id;

  if (token == "" || token == undefined || token == null || id == undefined || id == "" || id <= 0 || id == null) {
    Erro.code1004(res);
  } else {
    User.checkToken(token, (err, userchecktoken) => {
      if (err) {
        Erro.code1001(res);
      } else {
        if (userchecktoken.length !== 0) {

          Post.CheckPostById(id, (err, post) => {
            if (err) {
              Erro.code1001(res);
            } else {
              if (post.length !== 0) {
                var arraylistuserlike = post[0].id_list_user_like.split(",");
                var checkuerlike = 0;
                for (let i = 0; i < arraylistuserlike.length; i++) {
                  //    console.log(arrayidcomment[i]);
                  if (arraylistuserlike[i] == userchecktoken[0].id_user) {
                    checkuerlike = 1;
                    console.log("da tim thay id user da like" + arraylistuserlike[i]);
                    arraylistuserlike.splice(i, 1);
                  }
                }
                if (checkuerlike == 0) {
                  if (arraylistuserlike == "0") {
                    arraylistuserlike = "";
                  }
                  arraylistuserlike = arraylistuserlike.toString() + userchecktoken[0].id_user + ",";
                  console.log("khi chua like thi like vao" + arraylistuserlike);
                }
                Post.updateLike(id, arraylistuserlike.toString(), (err, Postnewcomment) => {
                  if (err) {
                    Erro.code1001(res);
                  }
                  else {
                    if (Postnewcomment.changedRows == 1) {
                      Post.CheckPostById(id, (err, post) => {
                        if (err) {
                          Erro.code1001(res);
                        } else {
                          if (post.length !== 0) {
                            var alliduserlike = post[0].id_list_user_like.split(",").length;
                            if (alliduserlike < 0 || alliduserlike > 10000000) {
                              if (checkuerlike == 1) {
                                res.send(JSON.stringify({
                                  message: 'b???n ???? th??ch b??i vi???t'
                                }));
                              } else {
                                res.send(JSON.stringify({
                                  message: 'kh??ng c?? l?????t th??ch n??o'
                                }));
                              }
                            }
                            else if (alliduserlike == 0 && checkuerlike == 0) {
                              res.send(JSON.stringify({
                                message: 'B???n th??ch b??i vi???t'
                              }));
                            } else {
                              res.send(JSON.stringify({
                                code: 1000,
                                message: 'ok',
                                data: post[0].id_list_user_like.split(",").length - 1
                              }));
                            }
                          } else {
                            Erro.code9992(res);
                          }
                        }
                      })
                    } else {
                      Erro.codeNoNet(res);
                    }
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
