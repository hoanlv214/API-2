const db = require('../common/connect');

const Post = function (post) {
    this.id_post = post.id_post;
    this.id_user = post.id_user;
    this.content_post = post.content_post;
    this.media = post.media;
    this.id_list_user_cm = post.id_list_user_cm;
    this.id_list_user_like = post.id_list_user_like;
    this.date_create = post.date_create;
}

Post.AddPost = function (data, result) {
    db.query("INSERT INTO tbl_post SET ?", data, function (err, post) {
        if (err) {
            console.log('Error create user', err);
            return (null);
        }
        else {
            console.log('Create user successfully');
            result({ id: post.insertId, ...data });
        }
    });

}
Post.CheckIdUser = (IdUser, result) => {
    console.log(IdUser);
    db.query('SELECT * FROM tbl_post WHERE 	id_user = ?', IdUser, (err, res) => {
        if (err) {
            console.log('Error check id  user ', err);
            result(err, null);
        } else {
            console.log('Check id user successfully');
            result(null, res);
        }
    })
}

Post.CheckPostById = (IdPost, result) => {
    //   console.log(IdPost);
    db.query('SELECT * FROM tbl_post WHERE 	id = ?', IdPost, (err, res) => {
        if (err) {
            console.log('Error check id  post ', err);
            result(err, null);
        } else {
            console.log('Check id post successfully');
            result(null, res);
        }
    })
}

Post.get_list_posts = function (result) {
    db.query("SELECT * FROM tbl_post", function (err, post) {
        //   console.log(user);
        if (err) {
            result(null);
        } else {
            result(post);
        }
    });
}

Post.get_list_post_id_to_id = (index, count, result) => {
    db.query(`SELECT * FROM tbl_post LIMIT ${count} OFFSET ${index}`, (err, res) => {
        //"SELECT * FROM customers LIMIT 5 OFFSET 2";
        if (err) {
            console.log('Error while fetching post', err);
            result(err, null);
        } else {
            console.log('Post fetched successfully');
            result(null, res);
        }
    })
}

Post.updatePost = (id, content_post, result) => {
    db.query("UPDATE tbl_post SET content_post = ? WHERE id = ?", [content_post, id],
        (err, res) => {
            if (err) {
                console.log('Error update token', err);
                result(err, null);

            } else {
                console.log('Update token successfully');
                result(null, res);
            }
        })
}

Post.Delete = (id, result) => {
    db.query('DELETE FROM tbl_post WHERE id = ?', id, (err, res) => {
        if (err) {
            console.log('Error Delete Post', err);
            result(err, null);
        } else {
            console.log('deleted post');
            result(null, res);
        }
    });

}

// 
Post.CheckCommnetByID = (IdPost, result) => {
    //   console.log(IdPost);
    db.query('SELECT * FROM tbl_comment WHERE id_post = ?', IdPost, (err, res) => {
        if (err) {
            console.log('Error check comment in post ', err);
            result(err, null);
        } else {
            console.log('Checkcomment in post successfully');
            result(null, res);
        }
    })
}

Post.CheckCommnetByID2 = (result) => {
  
    var sql = "SELECT tbl_comment.id AS comment, user.name_user AS Poster FROM tbl_comment JOIN user ON tbl_comment.id_user = user.id_user";
   
    db.query(sql, (err, res) => {
        if (err) {
            console.log('Error  ', err);
            result(err, null);
        } else {
            console.log('');
            result(null, res);
        }
    })
}

module.exports = Post;