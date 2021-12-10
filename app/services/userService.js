var User = require('../models/user.model');

let checkuserlogin = async function(gamil_user){
    return new Promise((async (resolve, reject) => {
        try {
            let data = await User.authcheckgmail_user(gamil_user);
            console.log(data);
            resolve(data[0]);

        } catch (e) {
            resolve(data);
        }
    }));
  
}
let checkbyid = async function (iduser) {
    return new Promise((async (resolve, reject) => {
        try {
            let data = await User.authcheckuserbyid(iduser);
            console.log(data);
            resolve(data[0]);

        } catch (e) {
            resolve(data);
        }
    }));
}
module.exports = {

    checkuserlogin: checkuserlogin,
    checkbyid:checkbyid,
}
