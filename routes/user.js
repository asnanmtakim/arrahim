var express = require('express');
var router = express.Router();
var conn = require("../koneksi/conn");
function petik(str) { 
    return str.replace(/'/g, "''");
}

router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        var sql = "SELECT * FROM user";
        let result;
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render('user/index', {
                menu: 'User',
                username: req.session.username,
                listuser: result
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/tambah', function(req, res, next) {
    if (req.session.loggedin) {
        res.render('user/tambah', {
            menu: 'User',
            username: req.session.username,
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/tambah', function(req, res, next) {
    var username = petik(req.body.username);
    var password = petik(req.body.password);
    var sql = "INSERT INTO user (username, password, role) VALUES('" + username + "','" + password + "', 1);";
    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/user');
        } else {
            req.flash('success', 'Data Berhasil Ditambah');
            res.redirect('/user');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM user WHERE id_user = '" + id + "';";
        conn.query(sql, function (err,result){
            res.render('user/edit', {
                menu: 'User',
                username: req.session.username,
                user: result[0]
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/edit', function(req, res, next) {
    var id = req.body.id;
    var username = petik(req.body.username);
    var password = petik(req.body.password);
    var sql = "UPDATE user SET username = '"+username+"', password = '"+password+"' WHERE id_user ='"+id+"'";
    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/user');
        } else {
            req.flash('success', 'Data Berhasil Diubah');
            res.redirect('/user');
        }
    });
});

router.get('/hapus/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "DELETE FROM user WHERE id_user = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/user');
            } else {
                req.flash('success', 'Data Berhasil Hihapus');
                res.redirect('/user');
            }
        });
    } else {
        res.redirect('/auth');
    }
});

module.exports = router;
