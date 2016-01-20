chat-demo 基于socket.io的聊天室练习
==================================
socket.io
本地打开localhost:3001

>客户端

```
//建立websocket连接，客户端发起连接
    socket = io.connect('http://localhost:3001');
    //收到server的连接确认，服务端发出的open事件，如果发出的是"myopen"，则socket.on('myopen'
    socket.on('open', function(msg) {
        socket.emit('myopen',{msg:"哈哈"});
    });
```

>服务端

```javascript
//服务端监听到连接
io.on('connection', function(socket) {
    socket.emit('open'); //通知客户端已连接，open是自定义名称，可以是"myopen"
});
```
服务端socket.emit(e, obj)的两个参数,第一个e是事件名称，string类型，自定义。另一个是Object对象，需要传递到客户端的消息。同样，客户端也可以发起事件，由服务端的socket监听。