var express = require('express');
var users = express.Router();

/* GET users listing. */
users.get('/', function(req, res) {
  res.render('index.html', {});
});

module.exports = users;
