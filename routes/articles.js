var express = require('express');
var db = require('../db');
const { render } = require('../app');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(req.query);
    db.query('select *,date_format(article_date,"%Y-%m-%d %H:%i:%s") article_date from articles where article_id=?', Number(req.query.aid), function(r, fields) {
        if (r.length > 0) {
            db.query('SELECT * FROM articles a,comments b,users c WHERE a.article_id=b.article_id and b.article_id=? and b.user_id=c.user_id', Number(req.query.aid), function(results, fields) {
                console.log(results.length);
                if (results.length > 0) {

                    res.render('article/article', { data: r, comm: results });
                } else {
                    res.render('article/article', { data: r, comm: null });
                }
            })
        } else {
            res.send({ code: 0, msg: '找不到该文章' })
        }
    })
    db.query('UPDATE articles SET article_views =article_views+1 WHERE article_id=?', req.query.aid, function(r, fields) {

    })
});
router.get('/edit', function(req, res) {
    db.query('select * from articles where article_id=?', req.query.aid, function(r, fields) {
        if (r.length > 0) {
            res.render('article/edit', { data: r })
        } else {
            res.send('err')
        }
    })
})
router.post('/edit', function(req, res) {
        db.query('update articles set article_title=?,article_content=? where article_id=?', [
            req.body.title, req.body.content, req.body.pid
        ], function(r, fields) {
            if (r.affectedRows > 0) {
                res.send('修改成功')
            } else {
                res.send('err')
            }
        })
    })
    //新增
router.get('/like', function(req, res) {
    db.query('UPDATE articles SET article_like_count =article_like_count+1 WHERE article_id=?', req.query.aid, function(r, fields) {
        if (r.affectedRows > 0) {
            res.redirect('/articles?aid=' + req.query.aid)
        } else {
            res.send('err')
        }
    })
})
module.exports = router;