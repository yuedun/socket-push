
var gso;
exports.init = function (nspio) {
    nspio.use((socket, next) => {
		const token = socket.handshake.auth.token;
		debug(">>>>>>>>caht-event中间件", token);
		next();
	});
    nspio.on('connection', function (socket) {
        gso = socket;
        socket.emit('open', { text: "连接成功" }); //通知客户端已连接
        //监听退出事件
        socket.on('disconnect', function () {
            console.log('Disconnect');
        });
    });
};
exports.play = function (msg) {
    gso.emit('message', { text: msg });
}
exports.stop = function () {
    gso.emit("stop");
}
