var app = require('koa')()
  , koa = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror');

// var serve1 = require('koa-static-server');

var resource = require('koa-resourcer')

var index = require('./routes/index');
var users = require('./routes/users');
var logs = require('./routes/logs');

var conf = require('./config/conf');

//日志记录
var logger = require('mini-logger');

let log = logger(conf.log);
global.logger = log;

// error handler
onerror(app);

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'ejs'
}));
app.use(require('koa-bodyparser')());
app.use(json());
// app.use(logger());

app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});


// app.use(serve1({rootDir: 'public'}));
// app.use(serve1({rootDir: 'logs',rootPath: '/logs'}));
// resource(app, require('path').join(__dirname, 'logs'),function(o){
//   console.log('mounted %s', o.path, o.resource)
// })




// app.use(serve1(__dirname + '/public/logs'));

// routes definition
koa.use('/', index.routes(), index.allowedMethods());
koa.use('/users', users.routes(), users.allowedMethods());
koa.use('/logs', logs.routes(), users.allowedMethods());


app.use(require('koa-static')(__dirname + '/public'));

// mount root routes
app.use(koa.routes());


module.exports = app;
