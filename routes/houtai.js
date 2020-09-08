var express = require('express');
var db = require('../db');
const { render } = require('../app');
var router = express.Router();

/* GET users listing. */
// router.get('/', function(req, res) {
//     res.render('backend/')
// })
router.get('/', function(req, res, next) {
    db.query('select * from users', [], function(r, fields) {
        if (r.length > 0) {
            res.render('backend/mUser', { data: r })

        }
    })
});
router.get('/userEdit', function(req, res, next) {
    db.query('select * from users', [], function(r, fields) {
        if (r.length > 0) {
            res.render('backend/mUser', { data: r })

        }
    })
});
router.get('/userDel', function(req, res, next) {
    db.query('select * from users', [], function(r, fields) {
        if (r.length > 0) {
            res.render('backend/mUser', { data: r })

        }
    })
});
router.get('/art', function(req, res, next) {
    res.render('backend/mArticle')
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