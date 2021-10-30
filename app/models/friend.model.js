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

Friend.get_requested_friend= (id_user,get_requested_friend, result) =>{
    db.query(`UPDATE user SET get_requested_friend = '${get_requested_friend}' WHERE id_user = '${id_user}'`,(err, res) =>{
        if (err){
            console.log('Error update get_request_friend', err);
            result(err,null);
        }else {
            console.log('Update get_request_friend successfully');
            result(null, res);
        }
    })
}


Friend.addset_request_friend= (id_user,set_request_friend, result) =>{
    db.query(`UPDATE user SET set_request_friend = '${set_request_friend}' WHERE id_user = '${id_user}'`,(err, res) =>{
        if (err){
            console.log('Error update get_request_friend', err);
            result(err,null);
        }else {
            console.log('Update get_request_friend successfully');
            result(null, res);
        }
    })
}


module.exports = Friend;