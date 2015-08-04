var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var movies = require('./routes/movies');
var file = require('./routes/file');

var routes = require('./routes/index');
var users = require('./routes/users');

var connectionString = 'mongodb://localhost/oniondb';
mongoose.connect(connectionString);

var app = express();

// 防盗链
var AntiLeech = require('express-anti-leech');
// 允许引用的域名白名单
var hosts = ['localhost', 'localhost:3000'];
// 反盗链类型
var exts = ['.png', '.jpg', '.jpeg', '.gif', '.swf', '.flv'];
// 盗链默认指向图片
var pictrue = "/images/default.jpg";
app.use(AntiLeech({
  allow: hosts,
  exts: exts,
  log: console.log, // 你也可以使用自己的方法来记录
  default: pictrue
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
var ejs = require('ejs');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', movies);
app.use('/myfile', file);

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
