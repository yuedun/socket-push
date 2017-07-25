var express = require('express');
var router = express.Router();
var socketEvent = require('./notify-event');

//在线聊天
router.get('/', function (req, res) {
	res.render('index.html', {});
});

/**
 * 文字转语音通知
 */
router.get('/notify', function (req, res) {
	res.render('notify.html', {});
});

/**
 * 文字转语音通知
 */
router.get('/notify', function (req, res) {
	res.render('notify.html', {});
});

/**
 * 打开发送通知
 */
router.get('/sendpage', function (req, res) {
	res.render("sendpage.html");
});
/**
 * 发送通知
 */
router.get('/sendmsg', function (req, res) {
	var msg = req.query.text;
	socketEvent.play(msg);
	res.send("发送完成")
});
/**
 * 文字停止闪烁
 */
router.get('/stop', function (req, res) {
	socketEvent.stop();
	res.send(">.")
});

module.exports = router;
