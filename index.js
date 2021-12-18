var express= require('express');
var app = express();
const path = require('path');

var bodyParser = require('body-parser');
require('dotenv').config();

//moi them
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./app/common/passport-config')

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )

  app.use(express.static(path.join(__dirname, 'public')));
  
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.engine('ejs', require('express-ejs-extend')); // add this line
app.set("view engine", "ejs");
app.set("views","./app/views");

// them phan authentication
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.locals.error =null;

//app.get('/login', checkNotAuthenticated, homeController.login)

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('loginuser/login.ejs')
})
app.get('/trangchu', checkAuthenticated, (req, res) => {
  res.render('conversation.ejs')
})
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/trangchu',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('testlogin/register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/trangchu')
  }
  next()
}


require('./app/routers/user.router')(app);
require('./app/routers/post.router')(app);
require('./app/routers/comment.router')(app);
require('./app/routers/chat.router')(app);
require('./app/routers/search.router')(app);
require('./app/routers/friend.router')(app);
require('./app/routers/admin.router')(app);

app.listen(3000,function(){
console.log("Server ok");

})
