var express = require('express'); //function createApplication()
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var http = require('http');
var ioServer = require('socket.io')
var indexroute = require('./routes/index');
var action = require('./routes/socketAction');

var app = express(); //执行以后返回function (req,res,next){app.handle(req, res, next);}
// var io = socket.listen(3001);
var io = ioServer(3001);//两种方式都可以，暂不知区别

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
//less-middleware可以编译less文件为css启动时不会编译，访问时才编译
app.use(require('less-middleware')(path.join(__dirname, 'public'), {debug: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(indexroute);

//设置日志级别
//io.set('log level', 1);
//websocket连接监听,所有基于事件的都继承自event,on监听事件，once监听一次
io.on('connection', function (socket) {
    action(socket);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;