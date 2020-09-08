const conn = require('../db');

exports.findUsers = function(callback) {
    conn.query(`select id,username,status,role,date_format( create_time, '%Y-%m-%d' ) create_time from user`, callback);
}

exports.findUserByNameAndPsw = function(username, password, callback) {
    conn.query('select * from user where username=? and password=?', [username, password], callback);
}

exports.findUserById = function(id, callback) {
    conn.query('select * from user where id=?', id, callback);
}

exports.findUserByName = function(name, cb) {
        conn.query('select * from user where username=?', name, cb);
    }
    //注册
exports.signup = function(params, callback) {
    conn.query('insert into user set ?', params, callback)
}