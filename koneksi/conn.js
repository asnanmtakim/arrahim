var mysql = require('mysql');
var conn = mysql.createConnection({
    host:"localhost",
    user:"asnan",
    password:"asnan",
    database:"arrahim"
});

conn.connect(err=>{
    if(err) throw err;
    console.log("connect");
});

module.exports = conn;
