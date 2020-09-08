var mysql = require('mysql');
var dbConfig = require('./db.config');

module.exports = {
    query: function(sql, params, callback) {

        var conn = mysql.createConnection(dbConfig);
        conn.connect(function(err) {
            if (err) {
                console.log('数据库连接失败');
                // throw err;
                console.log(err);
            }
            conn.query(sql, params, function(err, r, fields) {
                if (err) {
                    console.log('数据操作失败');
                    // throw err;
                    console.log(err);
                }
                // console.log(JSON.parse(JSON.stringify(r)));

                callback && callback(r, fields);
                conn.end(function(err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        // throw err;
                        console.log(err);
                    }
                })
            })
        })
    }
}