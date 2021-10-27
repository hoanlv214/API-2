const db = require('../common/connect');

const Friend = function (friend) {
    this.id_friend = friend.id;

}
Friend.CheckFriendByID= (id_friend, result) => {
    db.query('SELECT * FROM tbl_comment WHERE id = ?', id_friend, (err, res) => {
        if (err) {
            console.log('Error check comment  ', err);
            result(err, null);
        } else {
            console.log('Checkcommentsuccessfully');
            result(null, res);
        }
    })
}


module.exports = Friend;