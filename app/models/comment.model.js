const db = require('../common/connect');

const Comment = function (comment) {
    this.id_comment = comment.id;

}

Comment.CheckCommnetByID = (IdComment, result) => {
    db.query('SELECT * FROM tbl_comment WHERE id = ?', IdComment, (err, res) => {
        if (err) {
            console.log('Error check comment  ', err);
            result(err, null);
        } else {
            console.log('Checkcommentsuccessfully');
            result(null, res);
        }
    })
}

Comment.AddComment = function (data, result) {
    db.query("INSERT INTO tbl_comment SET ?", data, function (err, comment) {
        if (err) {
            console.log('Error create user', err);
            return (null);
        }
        else {
            console.log('Create user successfully');
            result({ id: comment.insertId, ...data });
        }
    });

}

Comment.DeleteComment = (id, result) => {
    db.query('DELETE FROM tbl_comment WHERE id = ?', id, (err, res) => {
        if (err) {
            console.log('Error Delete Comment', err);
            result(err, null);
        } else {
            console.log('deleted comment');
            result(null, res);
        }
    });

}

Comment.updateComment = (idcomment, content_cm, result) =>{
    db.query(`UPDATE tbl_comment SET content_cm = '${content_cm}' WHERE id = '${idcomment}'`,(err, res) =>{
        if (err){
            console.log('Error update comment', err);
            result(err,null);
        }else {
            console.log('Update comment successfully');
            result(null, res);
        }
    })
}
module.exports = Comment;