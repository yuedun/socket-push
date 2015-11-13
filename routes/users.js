var express = require('express');
var users = express.Router();

/* GET users listing. */
users.get('/', function(req, res) {
  res.sendfile('views/chat.html', {});
});

module.exports = users;
