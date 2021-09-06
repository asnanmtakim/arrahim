var express = require('express');
var router = express.Router();
var conn = require("../koneksi/conn");
var uuid = require('uuid');
const PDFDocument = require('pdfkit');
function petik(str) { 
    return str.replace(/'/g, "''");
}

router.get('/', function(req, res, next) {
    if (req.session.loggedin) {
        var sql = "SELECT * FROM narasumber ORDER BY id_narasumber DESC";
        conn.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.render('narasumber/index', {
                menu: 'Narasumber',
                username: req.session.username,
                listnarasumber: result
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/tambah', function(req, res, next) {
    if (req.session.loggedin) {
        res.render('narasumber/tambah', {
            menu: 'Narasumber',
            username: req.session.username,
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/tambah', function(req, res, next) {
    var nama = petik(req.body.nama);
    var tempat_lahir = petik(req.body.tempat_lahir);
    var tanggal_lahir = req.body.tanggal_lahir;
    var jk = req.body.jk;
    var agama = req.body.agama;
    var kewarganegaraan = petik(req.body.kewarganegaraan);
    var status = req.body.status;
    var tinggi_badan = req.body.tinggi_badan;
    var berat_badan = req.body.berat_badan;
    var no_hp = req.body.no_hp;
    var email = req.body.email;
    var alamat = petik(req.body.alamat);
    var SD = petik(req.body.SD);
    var SMP = petik(req.body.SMP);
    var SMA = petik(req.body.SMA);
    var perguruan_tinggi = petik(req.body.perguruan_tinggi);
    var keahlian = petik(req.body.keahlian);
    var organisasi = petik(req.body.organisasi);
    var institusi = petik(req.body.institusi);
    if (!req.files) {
        var nama_foto = 'default.jpg';
        var sql = "INSERT INTO narasumber (nama, institusi, jenis_kelamin, tempat_lahir, tanggal_lahir, kewarganegaraan, agama, status_perkawinan, tinggi_badan, berat_badan, alamat_lengkap, no_hp, email, SD, SMP, SMA, perguruan_tinggi, keahlian, organisasi, foto) VALUES('" + nama + "','" + institusi + "','" + jk + "','" + tempat_lahir + "','" + tanggal_lahir + "','" + kewarganegaraan + "','" + agama + "','" + status + "','" + tinggi_badan + "','" + berat_badan + "','" + alamat + "','" + no_hp + "','" + email + "','" + SD + "','" + SMP + "','" + SMA + "','" + perguruan_tinggi + "','" + keahlian + "','" + organisasi + "','" + nama_foto + "');";
        conn.query(sql, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.redirect('/narasumber');
            } else {
                req.flash('success', 'Data Berhasil Ditambah');
                res.redirect('/narasumber');
            }
        });
    } else {
        var foto = req.files.foto;
        if (foto.mimetype == "image/jpeg" || foto.mimetype == "image/png" || foto.mimetype == "image/gif") {
            var uuidname = uuid.v1();
            var nama_foto = uuidname + foto.name;
            foto.mv('public/uploads/' + nama_foto, function (err) {
                if (err) {
                   return res.status(500).send(err);
                } else {
                    var sql = "INSERT INTO narasumber(nama, institusi, jenis_kelamin, tempat_lahir, tanggal_lahir, kewarganegaraan, agama, status_perkawinan, tinggi_badan, berat_badan, alamat_lengkap, no_hp, email, SD, SMP, SMA, perguruan_tinggi, keahlian, organisasi, foto) VALUES('" + nama + "','" + institusi + "','" + jk + "','" + tempat_lahir + "','" + tanggal_lahir + "','" + kewarganegaraan + "','" + agama + "','" + status + "','" + tinggi_badan + "','" + berat_badan + "','" + alamat + "','" + no_hp + "','" + email + "','" + SD + "','" + SMP + "','" + SMA + "','" + perguruan_tinggi + "','" + keahlian + "','" + organisasi + "','" + nama_foto + "');";
                    conn.query(sql, function (err, result) {
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/narasumber');
                        } else {
                            req.flash('success', 'Data Berhasil Ditambah');
                            res.redirect('/narasumber');
                        }
                    });
               }
            });
        } else {
            req.flash('error', 'Foto harus dalam format jpeg/png/gif');
            res.redirect('/narasumber/tambah');
        }
    }
});

router.get('/edit/:id', function(req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM narasumber WHERE id_narasumber = '" + id + "';";
        conn.query(sql, function (err,result){
            res.render('narasumber/edit', {
                menu: 'Narasumber',
                username: req.session.username,
                narasumber: result[0]
            });
        });
    } else {
        res.redirect('/auth');
    }
});

router.post('/edit', function (req, res, next) {
    var id = req.body.id;
    var nama = petik(req.body.nama);
    var tempat_lahir = petik(req.body.tempat_lahir);
    var tanggal_lahir = req.body.tanggal_lahir;
    var jk = req.body.jk;
    var agama = req.body.agama;
    var kewarganegaraan = petik(req.body.kewarganegaraan);
    var status = req.body.status;
    var tinggi_badan = req.body.tinggi_badan;
    var berat_badan = req.body.berat_badan;
    var no_hp = req.body.no_hp;
    var email = req.body.email;
    var alamat = petik(req.body.alamat);
    var SD = petik(req.body.SD);
    var SMP = petik(req.body.SMP);
    var SMA = petik(req.body.SMA);
    var perguruan_tinggi = petik(req.body.perguruan_tinggi);
    var keahlian = petik(req.body.keahlian);
    var organisasi = petik(req.body.organisasi);
    var institusi = petik(req.body.institusi);
    if (!req.files) {
        var sql = "UPDATE narasumber SET nama='" + nama + "', institusi='" + institusi + "', jenis_kelamin='" + jk + "', tempat_lahir='" + tempat_lahir + "', tanggal_lahir='" + tanggal_lahir + "', kewarganegaraan='" + kewarganegaraan + "', agama='" + agama + "', status_perkawinan='" + status + "', tinggi_badan='" + tinggi_badan + "', berat_badan='" + berat_badan + "', alamat_lengkap='" + alamat + "', no_hp='" + no_hp + "', email='" + email + "', SD='" + SD + "', SMP='" + SMP + "', SMA='" + SMA + "', perguruan_tinggi='" + perguruan_tinggi + "', keahlian='" + keahlian + "', organisasi='" + organisasi + "' WHERE id_narasumber='" + id + "';";
        conn.query(sql, function (err, result) {
            if (err) {
                req.flash('error', err);
                res.redirect('/narasumber');
            } else {
                req.flash('success', 'Data Berhasil Diubah');
                res.redirect('/narasumber');
            }
        });
    } else {
        var foto = req.files.foto;
        if (foto.mimetype == "image/jpeg" || foto.mimetype == "image/png" || foto.mimetype == "image/gif") {
            var nama_foto = id + foto.name;
            foto.mv('public/uploads/' + nama_foto, function (err) {
                if (err) {
                   return res.status(500).send(err);
                } else {
                    var sql = "UPDATE narasumber SET nama='" + nama + "', institusi='" + institusi + "', jenis_kelamin='" + jk + "', tempat_lahir='" + tempat_lahir + "', tanggal_lahir='" + tanggal_lahir + "', kewarganegaraan='" + kewarganegaraan + "', agama='" + agama + "', status_perkawinan='" + status + "', tinggi_badan='" + tinggi_badan + "', berat_badan='" + berat_badan + "', alamat_lengkap='" + alamat + "', no_hp='" + no_hp + "', email='" + email + "', SD='" + SD + "', SMP='" + SMP + "', SMA='" + SMA + "', perguruan_tinggi='" + perguruan_tinggi + "', keahlian='" + keahlian + "', organisasi='" + organisasi + "', foto='" + nama_foto + "' WHERE id_narasumber='" + id + "';";
                    conn.query(sql, function (err, result) {
                        if (err) {
                            req.flash('error', err);
                            res.redirect('/narasumber');
                        } else {
                            req.flash('success', 'Data Berhasil Diubah');
                            res.redirect('/narasumber');
                        }
                    });
               }
            });
        } else {
            req.flash('error', 'Foto harus dalam format jpeg/png/gif');
            res.redirect('/narasumber/edit/'+id+'');
        }
    }
});

router.get('/hapus/:id', function (req, res, next) {
    if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "DELETE FROM narasumber WHERE id_narasumber = '"+id+"';"
        conn.query(sql, function(err, result){
            if (err) {
                req.flash('error', err);
                res.redirect('/narasumber');
            } else {
                req.flash('success', 'Data Berhasil Hihapus');
                res.redirect('/narasumber');
            }
        });
    } else {
        res.redirect('/auth');
    }
});

router.get('/cv/:id', function (req, res, next) {
   
//console.log("dfas");


 if (req.session.loggedin) {
        var id = req.params.id;
        var sql = "SELECT * FROM narasumber WHERE id_narasumber = '" + id + "';";
        conn.query(sql, function (err, result) {
            var doc = new PDFDocument({
                bufferPages: true,
                size: 'FOLIO',
                layout: 'portrait',
                margin: 0
            });
            
            let buffers = [];
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                res.writeHead(200, {
                    'Content-Length': Buffer.byteLength(pdfData),
                    'Content-Type': 'application/pdf',
                    'Content-disposition': 'inline;filename=narasumber_'+id+'.pdf',})
                    .end(pdfData);
                }); 
            doc.image('/home/asnanmtakim/Programming/Arrahim/public/dist/img/CV.png', 0, 0, { width: 612 });
            doc.image('/home/asnanmtakim/Programming/Arrahim/public/uploads/'+result[0].foto+'', 525, 245, { width: 60 });
            
            doc.font('Helvetica-Bold')
                .fontSize(30)
                .fillColor('white')
                .text(result[0].nama, 280, 30, {
                    width: 290,
                    align: 'center'
                });
            
            doc.font('Helvetica')
                .fontSize(20)
                .fillColor('white')
                .text(result[0].institusi, 280, 110, {
                    width: 290,
                    align: 'center'
                });
            
            doc.font('Times-Roman')
                .fontSize(12)
                .fillColor('black');
            
            doc.text('Nama', 280, 245)
                .text('Place of birth', 280, 265)
                .text('Day of birth', 280, 285)
                .text('Institution', 280, 305)
                .text('Phone', 280, 325)
                .text('Email', 280, 345)
                .text('Address', 280, 365);
            doc.text(': '+result[0].nama, 350, 245)
                .text(': '+result[0].tempat_lahir, 350, 265)
                .text(': '+result[0].tanggal_lahir, 350, 285)
                .text(': '+result[0].institusi, 350, 305)
                .text(': '+result[0].no_hp, 350, 325)
                .text(': '+result[0].email, 350, 345)
                .text(': '+result[0].alamat_lengkap, 350, 365);
            
            doc.text('1. '+result[0].SD, 280, 450)
                .text('2. '+result[0].SMP, 280, 470)
                .text('3. '+result[0].SMA, 280, 490)
                .text('4. '+result[0].perguruan_tinggi, 280, 510);
            
            doc.text(result[0].keahlian, 280, 600, {
                width: 290,
                align: 'justify'
            });
            
            doc.text(result[0].organisasi, 280, 720, {
                width: 290,
                align: 'justify'
            });
            
            var now = new Date();
            doc.text('Surabaya, '+now.getDate()+'/'+now.getMonth()+1+'/'+now.getFullYear(), 430, 840, {
                width: 180,
                align: 'center'
            });
            
            doc.text('( '+result[0].nama+' )', 430, 900, {
                width: 180,
                align: 'center'
            });
            doc.end();
            });
            } else {
        res.redirect('/auth');
    }

});

module.exports = router;
