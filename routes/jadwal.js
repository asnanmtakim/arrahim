var express = require('express');
var router = express.Router();
var conn = require("../koneksi/conn");
const PDFDocument = require('pdfkit');
function petik(str) { 
    return str.replace(/'/g, "''");
} 

router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        var sql = "SELECT * FROM jadwal LEFT JOIN host ON host.id_host=jadwal.id_host LEFT JOIN narasumber ON narasumber.id_narasumber=jadwal.id_narasumber ORDER BY id_jadwal DESC;";
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render('jadwal/index', {
                menu: 'Jadwal',
                username: req.session.username,
                listjadwal: result
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/tambah', function(req, res, next) {
    if (req.session.loggedin) {
        var sql = "SELECT * FROM host";
        var sql2 = "SELECT * FROM narasumber ORDER BY id_narasumber DESC";
        var sql3 = "SELECT MAX(no_sertif) as sertif FROM jadwal;";
        conn.query(sql, function (err, result1) {
            conn.query(sql2, function (err, result2) {
                conn.query(sql3, function (err, result3) {
                    res.render('jadwal/tambah', {
                        menu: 'Jadwal',
                        username: req.session.username,
                        host: result1,
                        narasumber: result2,
                        sertif: result3[0]
                    });
                });
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/tambah', function(req, res, next) {
    var host = req.body.host;
    var narasumber = req.body.narasumber;
    var no_sertif = req.body.no_sertif;
    var waktu_pelaksanaan = req.body.waktu_pelaksanaan;
    var tema = petik(req.body.tema);
    var sql = "INSERT INTO jadwal (id_host, id_narasumber, no_sertif, waktu_pelaksanaan, tema, status)VALUES('" + host + "','" + narasumber + "','" + no_sertif + "','" + waktu_pelaksanaan + "','" + tema + "', 0);";
    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/jadwal');
        } else {
            req.flash('success', 'Data Berhasil Ditambah');
            res.redirect('/jadwal');
        }
    });
});

router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM host";
        var sql2 = "SELECT * FROM narasumber ORDER BY id_narasumber DESC";
        var sql3 = "SELECT * FROM jadwal WHERE id_jadwal = '" + id + "';";
        conn.query(sql, function (err, result1) {
            conn.query(sql2, function (err, result2) {
                conn.query(sql3, function (err, result3) {
                    res.render('jadwal/edit', {
                        menu: 'Jadwal',
                        username: req.session.username,
                        host: result1,
                        narasumber: result2,
                        jadwal: result3[0]
                    });
                });
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/edit', function(req, res, next) {
    var id = req.body.id;
    var host = req.body.host;
    var narasumber = req.body.narasumber;
    var no_sertif = req.body.no_sertif;
    var waktu_pelaksanaan = req.body.waktu_pelaksanaan;
    var tema = petik(req.body.tema);
    var sql = "UPDATE jadwal SET id_host = '"+host+"', id_narasumber = '"+narasumber+"', no_sertif = '"+no_sertif+"', waktu_pelaksanaan = '"+waktu_pelaksanaan+"', tema = '"+tema+"' WHERE id_jadwal ='"+id+"'";
    conn.query(sql, function (err, result) {
        if (err) {
            req.flash('error', err);
            res.redirect('/jadwal');
        } else {
            req.flash('success', 'Data Berhasil Diubah');
            res.redirect('/jadwal');
        }
    });
});

router.get('/hapus/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "DELETE FROM jadwal WHERE id_jadwal = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/jadwal');
            } else {
                req.flash('success', 'Data Berhasil Dihapus');
                res.redirect('/jadwal');
            }
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/proses1/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "UPDATE jadwal SET status = 1 WHERE id_jadwal = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/jadwal');
            } else {
                req.flash('success', 'Data Berhasil Diproses');
                res.redirect('/jadwal');
            }
        });
    } else {
        res.redirect('/auth');
    }
});
router.get('/proses0/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "UPDATE jadwal SET status = 0 WHERE id_jadwal = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/jadwal');
            } else {
                req.flash('success', 'Data Berhasil Diproses');
                res.redirect('/jadwal');
            }
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/sertif/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM jadwal LEFT JOIN narasumber ON narasumber.id_narasumber=jadwal.id_narasumber WHERE id_jadwal = '" + id + "';";
        conn.query(sql, function (err, result) {
            var doc = new PDFDocument({
                bufferPages: true,
                size: 'FOLIO',
                layout: 'landscape',
                margin: 0
            });
            
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-disposition': 'inline;filename=jadwal_'+id+'.pdf',})
                    .end(pdfData);
                }); 
            doc.image('/home/si/Arrahim/public/dist/img/sertif.jpg', 0, 40, { width: 936 });
            doc.font('Helvetica-Bold')
            .fontSize(35)
            .fillColor('white')
            .text(result[0].nama, 118, 235, {
                width: 700,
                align: 'center'
            });
            doc.font('Helvetica-Bold')
            .fontSize(25)
            .fillColor('orange')
            .text(result[0].tema, 118, 350, {
                width: 700,
                align: 'center'
            });

            var jenis = '';
            if (result[0].jenis_kelamin == 'Perempuan') {
                jenis = 'her';
            } else {
                jenis = 'his';
            }
            doc.font('Helvetica')
            .fontSize(22)
            .fillColor('white')
            .text('for Sharing '+jenis+' Valuable Knwoledge as a Speaker', 118, 290, {
                width: 700,
                align: 'center'
            });
            doc.font('Times-Bold')
            .fontSize(20)
            .fillColor('white')
            .text(result[0].no_sertif, 118, 440, {
                width: 700,
                align: 'center'
            });
            doc.end();
            });
            } else {
        res.redirect('/auth');
    }
});

module.exports = router;
