var express = require('express');
var router = express.Router();
var db = require('../db')
var path = require('path')



/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session && req.session.remember == true) {
        db.query('select *,date_format(article_date,"%Y-%m-%d %H:%i:%s") article_date from articles limit 5', {}, function(r, fields) {
            console.log('session', req.session.user);
            res.render('index', { user: req.session.user, data: r })
        })
    } else {
        db.query('select *,date_format(article_date,"%Y-%m-%d %H:%i:%s") article_date from articles limit 5', {}, function(r, fields) {
            res.render('index', { user: {}, data: r });
        })
    }
});
router.get('/home', function(req, res, next) {
    if (req.session && req.session.remember == true) {
        db.query('select * from articles limit 5', {}, function(r, fields) {
            console.log('session', req.session.user);
            res.render('index', { user: req.session.user, data: r })
        })
    } else {
        db.query('select * from articles limit 5', {}, function(r, fields) {
            res.render('index', { user: {}, data: r });
        })
    }
});
router.get('/master-blog', function(req, res, next) {

    db.query('select * from articles where user_id=0 limit 5', {}, function(r, fields) {
        console.log('session', req.session.user);
        res.render('index', { user: req.session.user, data: r })
    })

});
router.get('/recommed-blog', function(req, res, next) {

    db.query('SELECT * FROM articles ORDER BY article_comment_count DESC,article_like_count DESC,article_views DESC limit 5', {}, function(r, fields) {
        console.log('session', req.session.user);
        res.render('index', { user: req.session.user, data: r })
    })

});
router.get('/recent-blog', function(req, res, next) {

    db.query('SELECT * FROM articles ORDER BY article_date DESC limit 5', {}, function(r, fields) {
        console.log('session', req.session.user);
        console.log(r);
        res.render('index', { user: req.session.user, data: r })
    })

});
router.get('/all-blog', function(req, res, next) {

    db.query('select * from articles limit 5', {}, function(r, fields) {
        // console.log('session', req.session.user);
        res.render('index', { user: req.session.user, data: r })
    })

});
router.get('/my-blog', function(req, res, next) {
    var uid = JSON.parse(req.cookies.user)[0].user_id
    console.log('11111111111111111', JSON.parse(req.cookies.user)[0].user_id);

    db.query('SELECT * FROM articles WHERE user_id=7 limit 5', uid, function(r, fields) {
            console.log(r);
            res.render('index', { user: req.session.user, data: r })
        })
        // } else {
        //     db.query('select * from articles limit 5', {}, function(r, fields) {
        //         res.render('index', { user: {}, data: r });
        //     })
        // }
});
router.get('/postArt', function(req, res, next) {
    res.render('article/post')
});
router.post('/postArt', function(req, res, next) {
    // if (req.cookies.user) {
    //     var user = JSON.parse(req.cookies.user)

    // }
    db.query(`insert into articles(user_id,article_title,article_content,article_date) values(?,?,?,now())`, [
        req.body.user_id, req.body.title, req.body.content
    ], function(r, fields) {
        if (r.affectedRows > 0) {
            res.send('发布成功')
        } else {
            res.send('发布失败')

        }
    })

});

router.post('/comment', function(req, res) {
    console.log('req', req.body);
    db.query('insert into comments(user_id,article_id,comment_date,comment_content) values(?,?,now(),?)', [
        Number(req.body.user_id), Number(req.body.article_id), req.body.comments
    ], function(r, fields) {
        if (r.affectedRows > 0) {
            db.query(`UPDATE articles set article_comment_count=(
                SELECT count(*) FROM comments WHERE article_id=?
            ) WHERE article_id=?`, [Number(req.body.article_id), Number(req.body.article_id)], function(r, fields) {
                console.log(r);
            })
            res.send('评论成功')
        } else {
            res.send('评论失败')

        }
    })
})
router.get('/setcookie', function(req, res) {
    res.cookie('express_cookie', 'hi,cookie', {
        maxAge: 8000
    })
    res.send('save')
})
router.get('/getcookie', function(req, res) {
    console.log(req.cookies);
    res.send(req.cookies)
})

//文件上传
router.get('/upload', function(req, res) {
    res.render('upload')
})
router.post('/upload', function(req, res) {
    //文件上传中间件把 post请求中的文件二进制信息解析至 req.files属性中
    console.log(req.files);
    var fn = req.files.filename;
    var fp = path.join(__dirname, '../public/upload', fn.name)
    console.log(fp);
    fn.mv(fp, function(err) {
        if (err) {
            console.log(err);
        }
    })
    res.send('文件上传成功')
})
module.exports = router;