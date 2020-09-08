const conn = require('../db');
const result = require('../utils/result');

exports.findPosts = function(callback) {
    conn.query(`SELECT a.id,b.id uid,b.username,b.gender,b.intro,b.avater,(
      SELECT count(*) FROM comment c WHERE a.id=c.pid) comment_count,
      title,content,userid,DATE_FORMAT(a.createtime,'%Y-%m-%d %H:%i:%s') create_time,a.views FROM posts a inner JOIN
      user b on userid=b.id`, callback);
}
exports.findPostsById = function(pid, callback) {
    conn.query(`SELECT a.id,b.id uid,b.username,b.gender,b.intro,b.avater,(
      SELECT count(*) FROM comment c WHERE a.id=c.pid) comment_count,
      title,content,userid,DATE_FORMAT(a.createtime,'%Y-%m-%d %H:%i:%s') create_time,a.views FROM posts a inner JOIN
      user b on userid=b.id where a.id=?`, pid, callback);
}

exports.createPost = function(userid, title, content, callback) {
    conn.query('insert into posts(userid,title,content) values(?,?,?)', [userid, title, content], callback)
}
exports.modifyPost = function(title, content, id, callback) {
    conn.query('update posts set title=?,content=? where id=?', [title, content, id], callback)
}
exports.findPostsUserByPages = function(page, pagetotal, callback) {
    conn.query(`SELECT a.id,b.id uid,b.username,b.gender,b.intro,b.avater,(
        SELECT count(*) FROM comment c WHERE a.id=c.pid) comment_count,
        title,content,userid,DATE_FORMAT(a.createtime,'%Y-%m-%d %H:%i:%s') create_time,a.views FROM posts a inner JOIN
        user b on userid=b.id limit ?,?`, [(page - 1) * pagetotal, pagetotal], callback);
}
exports.countPosts = function(callback) {
    conn.query('select count(*) amount from posts', function(err, r) {
        if (err) {
            console.log(err);
            callback(-1)
        }
        if (r.length > 0) {
            callback(r[0]['amount'])
        }
    })
}

// exports.countPosts(function(r) {
//     console.log(r);
// })
exports.findUserByNameAndPsw = function(username, password, callback) {
    conn.query('select * from user where username=? and password=?', [username, password], callback);
}
exports.findUserById = function(id, callback) {
    conn.query('select * from user where id=?', id, callback);
}

exports.findUserByName = function(name, cb) {
    conn.query('select * from user where username=?', name, cb);
}