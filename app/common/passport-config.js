const LocalStrategy = require('passport-local').Strategy
var UserService = require('../services/userService');
//const bcrypt = require('bcrypt')

function initialize(passport, getUserByphoneuser, getUserById) {
  const authenticateUser = async (phoneuser, password, done) => {
    const user = await UserService.checkuserlogin(phoneuser);
   // console.log(user);
    if (user == null) {
      return done(null, false, { message: 'Người dùng không tồn tại' })
    }

    try {
      // check password
      if (password==user.pass_user) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Mật khẩu sai'})
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'phoneuser' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id_user))
  passport.deserializeUser(async(id, done) => {
    var user= await UserService.checkbyid(id);
    return done(null,user)
  })
}

module.exports = initialize