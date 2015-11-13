var express = require('express');//function createApplication()
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();//执行以后返回function (req,res,next){app.handle(req, res, next);}
var server = http.createServer(app);
var io = require('socket.io').listen(server); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(favicon(__dirname+'/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
app.use(users);

//设置日志级别
//io.set('log level', 1);
//websocket连接监听,所有基于事件的都继承自event,on监听事件，once监听一次
io.on('connection',function(socket){
   socket.emit('open');//通知客户端已连接
    //打印握手信息
    console.log(socket.handshake);

    //构造客户端对象
    var client = {
        socket:socket,
        name:false,
        color:getColor()
    };

    //对message事件监听
    socket.on('message',function(msg){
        var obj = {time:getTime(),color:client.color};
        //判断是不是第一次连接，以第一条消息作为用户名
        if(!client.name){
            client.name=msg;
            obj['text']=client.name;
            obj['author']='System';
            obj['type']='welcome';
            console.log(client.name+'-login');

            //返回欢迎语
            socket.emit('system',obj);
            //广播新用户已登录
            socket.broadcast.emit('system',obj);
        }else{
            //如果不是第一次的连接，正常的聊天消息
            obj['text']=msg;
            obj['author']=client.name;
            obj['tupe']='message';
            console.log(client.name+'say:'+msg);
            //返回消息（可以省略）
            socket.emit('message',obj);
            //广播想其他用户发消息
            socket.broadcast.emit('message',obj);
        }
    });
    //监听退出事件
    socket.on('disconnect',function(){
        var obj = {
            time:getTime(),
            color:client.color,
            author:'System',
            text:client.name,
            type:'disconnect'
        };
        //广播用户已退出
        socket.broadcast.emit('system',obj);
        console.log(client.name+'Disconnect');
    });
});
var getTime = function(){
    var date=new Date();
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
};
var getColor = function(){
    var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
        'orange','blue','blueviolet','brown','burlywood','cadetblue'];
    return colors[Math.round(Math.random()*10000%colors.length)]
};
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
server.listen(3001);
module.exports = app;