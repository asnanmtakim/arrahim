var express = require('express');
var router = express.Router();
var conn = require("../koneksi/conn");
function petik(str) { 
    return str.replace(/'/g, "''");
} 

router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        var sql = "SELECT * FROM host";
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            res.render('host/index', {
                menu: 'Host',
                username: req.session.username,
                listhost: result
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/tambah', function(req, res, next) {
    if (req.session.loggedin) {
        res.render('host/tambah', {
            menu: 'Host',
            username: req.session.username,
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/tambah', function(req, res, next) {
    var no_hp = req.body.no_hp;
    var nama = petik(req.body.nama);
    var alamat = petik(req.body.alamat);
    var sql = "INSERT INTO host (nama_host, alamat_host, no_hp_host)VALUES('" + nama + "','" + alamat + "','" + no_hp + "');";

    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/host');
        } else {
            req.flash('success', 'Data Berhasil Ditambah');
            res.redirect('/host');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM host WHERE id_host = '" + id + "';";
        conn.query(sql, function (err,result){
            res.render('host/edit', {
                menu: 'Host',
                username: req.session.username,
                host: result[0]
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/edit', function(req, res, next) {
    var id = req.body.id;
    var nama = petik(req.body.nama);
    var alamat = petik(req.body.alamat);
    var no_hp = req.body.no_hp;
    //var sql = "UPDATE host SET nama_host = 'Rahma''wati', alamat_host = '"+alamat+"', no_hp_host = '"+no_hp+"' WHERE id_host ='"+id+"'";
    var sql = "UPDATE host SET nama_host = '"+nama+"', alamat_host = '"+alamat+"', no_hp_host = '"+no_hp+"' WHERE id_host ='"+id+"'";
    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/host');
            console.log(nama);
        } else {
            req.flash('success', 'Data Berhasil Diubah');
            res.redirect('/host');
        }
    });
});

router.get('/hapus/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "DELETE FROM host WHERE id_host = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/host');
            } else {
                req.flash('success', 'Data Berhasil Hihapus');
                res.redirect('/host');
            }
        });
    } else {
        res.redirect('/auth');
    }
});

module.exports = router;
