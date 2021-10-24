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
module.exports = Comment;