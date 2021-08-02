var express = require('express');
var router = express.Router();
var conn = require("../koneksi/conn");

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.loggedin) {
    res.render('dashboard/content', { 
      menu: 'Dashboard',
      username: req.session.username
    });
	} else {
    res.redirect('/auth');
	}
});

/* GET auth page. */
router.get('/auth', function(req, res, next) {
  res.render('login', { expressFlash: req.flash('errlogin') });
});

router.post('/login', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		conn.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/');
			} else {
        req.flash('error', 'Username atau password salah!');
				res.redirect('/auth');
			}			
			res.end();
		});
	} else {
    req.flash('error', 'Username atau password tidak boleh kosong!');
		res.redirect('/auth');
		res.end();
	}
});

router.get('/logout', function(req, res){
  if (req.session.loggedin && req.session.username) {
    req.session.destroy(null);
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
