
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var flash = require('connect-flash');
var validator = require('validator');
var ensureLogin = require('connect-ensure-login');

var users = [{
  id: 1,
  username: 'czc5@qq.com',
  password: '$2a$10$dwuf5aN3ECCxgM686oXUT.UQbbre7qsiJz4D.lmPXpCqtXQBzBycq',
  province: '',
  city: ''
},{
  id: 2,
  username: 'czc555@gmail.com',
  password: '$2a$10$dwuf5aN3ECCxgM686oXUT.UQbbre7qsiJz4D.lmPXpCqtXQBzBycq',
  province: '',
  city: ''
}];
passport.use(new Strategy(
  function(username, password, cb) {
    var find = false;
    for (var i=0;i<users.length;i++) {
     if (users[i].username == username) {
       find = true;
       bcrypt.compare(password, users[i].password, function(err, res) {
          if (err) {
            return cb(err);
          }
          if (res) {
            return cb(null, users[i], { message: '登录成功' });
          } else {
            return cb(null, false, { message: '登录失败' });
          }
      });
      break;
     } 
    }
    if (!find) {
      cb(null, false, { message: '登录失败' });
    }
  }));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  for (var i=0;i<users.length;i++) {
    if (users[i].id == id) {
      return cb(null, users[i]);
    }
  }
  return cb(null);
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(flash());

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.get('/all', ensureLogin.ensureLoggedIn(), routes.all);
app.get('/my', ensureLogin.ensureLoggedIn(), routes.my);
app.get('/setting', ensureLogin.ensureLoggedIn(), routes.setting);
app.post('/my', ensureLogin.ensureLoggedIn(), routes.add);
app.get('/borrow/:book', ensureLogin.ensureLoggedIn(), routes.borrow);
app.get('/delete/:book', ensureLogin.ensureLoggedIn(), routes.delete);
app.get('/back/:book', ensureLogin.ensureLoggedIn(), routes.back);
app.post('/setting', ensureLogin.ensureLoggedIn(), function(req, res) {
  var province = req.body.province;
  var city = req.body.city;
  for (var i=0;i<users.length;i++) {
    if (users[i].id == req.user.id) {
      users[i].province = province;
      users[i].city = city;
    }
  }
  req.flash('info', '修改成功');
  return res.redirect('/setting');
});
app.post('/changePassoword', ensureLogin.ensureLoggedIn(), function(req, res) {
  var find = false;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  if (oldPassword=='') {
    req.flash('info', '请输入原密码');
    return res.redirect('/setting');
  }
  if (newPassword=='') {
    req.flash('info', '请输入新密码');
    return res.redirect('/setting');
  }
  for (var i=0;i<users.length;i++) {
   if (users[i].id == req.user.id) {
     find = true;
     bcrypt.compare(oldPassword, users[i].password, function(err, result) {
        if (err) {
          req.flash('info', '服务器错误');
          return res.redirect('/setting');
        }
        if (result) {
          req.flash('info', '修改成功');
          bcrypt.hash(newPassword, 10, function(err, hash) {
            if (err) {
              req.flash('info', '服务器错误');
              return res.redirect('/setting');
            }
            users[i].password = hash;
            req.logout();
            res.redirect('/');
          });
        } else {
          req.flash('info', '原密码错误');
          return res.redirect('/setting');
        }
    });
    break;
   } 
  }
  if (!find) {
    req.flash('info', '服务器错误');
    return res.redirect('/setting');
  }
});

app.get('/login',
  function(req, res){
    res.render('login', {message: req.flash('error')});
  });
  
app.post('/login', 
  passport.authenticate('local', { 
            failureRedirect: '/login',
            failureFlash: true,
            badRequestMessage: '邮箱和密码不能为空'
  }),
  function(req, res) {
    req.flash('info', '登录成功');
    res.redirect('/');
  });
  
app.get('/register', function(req, res) {
  res.render('register', {message: req.flash('info')});
});
  
app.post('/register', 
  function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (!email) {
      req.flash('info', '请输入邮箱地址');
      return res.redirect('/register');
    }
    if (!password) {
      req.flash('info', '请输入密码');
      return res.redirect('/register');
    }
    if (!validator.isEmail(email)){
      req.flash('info', '邮箱地址非法');
      return res.redirect('/register');
    }
    for (var i=0;i<users.length;i++) {
      if (users[i].email == email) {
        req.flash('info', '邮箱地址已存在');
        return res.redirect('/register');
      }
    }
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        req.flash('info', '服务器错误');
        return res.redirect('/register');
      }
      users.push({
        id:users.length+1,
        username: email,
        password: hash,
        province: '',
        city: ''
      });
    });
    req.flash('info', '注册成功');
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
