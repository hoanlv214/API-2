const db = require('../common/connect');

const Admin = function (admin) {
    this.id = admin.id_admin;
    this.phone = admin.phone_admin;
    this.pass = admin.pass_admin;
}

Admin.checkPhoneNumber = (phoneNumber, result) => {
    db.query('SELECT * FROM admin WHERE phone_admin = ?', phoneNumber, (err, res) => {
        if (err) {
            console.log('Error check phone number', err);
            result(err, null);
        } else {
            console.log('Check phone number successfully');
            result(null, res);
        }
    })
}

Admin.checkPass = (pass_admin, result) => {
    db.query('SELECT * FROM admin WHERE pass_admin = ?', pass_admin, (err, res) => {
        if (err) {
            console.log('Error check pass', err);
            result(err, null);
        } else {
            console.log('Check pass successfully');
            result(null, res);
        }
    })
}


Admin.createToken = (std, token, result) => {

    db.query("UPDATE admin SET token_admin = ? WHERE phone_admin = ?", [token, std],
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

Admin.checkToken = (token, result) => {
    db.query('SELECT * FROM admin WHERE token_admin = ?', token, (err, res) => {
        if (err) {
            console.log('Error check token ', err);
            result(err, null);
        } else {
            console.log('Check token ok');
            result(null, res);
        }
    })
}
module.exports = Admin;