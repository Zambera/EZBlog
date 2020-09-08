var express = require('express');
var db = require('../db');
var postDao = require('../model/postDao')
var userDao = require('../model/userDao')
const result = require('../utils/result');
var path = require('path')
const e = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var page = 1
        // console.log('session::user', req.session.user);s
    if (req.query.page && !isNaN(req.query.page)) {
        page = req.query.page
    }
    var pageTotal = 5 //每页显示页数
    postDao.countPosts(function(count) {
        if (count > 0) {
            postDao.findPostsUserByPages(page, pageTotal, function(err, r) {
                if (err) {
                    console.log(err)
                    res.render(error)
                    return
                }
                total = Math.ceil(count / pageTotal)
                var start = page - 2 <= 0 ? 1 : page - 2
                var end = start + 4 > total ? total : start + 4
                start = end - 4 > 0 ? end - 4 : 1
                    // console.log(start, end);
                var pageList = []
                for (var i = start; i <= end; i++) {
                    pageList.push(i)
                }
                // console.log(pageList);
                if (r.length > 0) {
                    // console.log(r);
                    res.render('posts', { user: req.session.user, list: r, total: total, pageList: pageList, page })
                }
            })
        } else {
            res.render('posts', { user: req.session.user, list: r, total: 0, pageList: {}, page: 1 })
        }
    })
})
router.get('/login', function(req, res) {
    res.render('post-login')
})
router.post('/login', function(req, res) {
    db.query('select * from user where username=? and password=?', [req.body.username, req.body.password], function(err, r) {
        if (err) {
            res.send({ code: 500, status: 'error', msg: '登录异常' })
            return
        }
        if (r && r.length > 0) {
            //登录成功 把user 对象保存到session中
            //同一个
            req.session.user = Object.assign({}, r[0])
            res.send({ code: 200, status: 'success', data: { username: 'zs' } })
        } else {
            res.send({ code: 500, status: 'error', msg: '用户名或密码错误' })
        }
    })
})
router.get('/logout', function(req, res) {
    req.session.destroy(function(err) {
        console.log('session对象被销毁');
    })
    res.redirect('/posts')
})
router.get('/signup', function(req, res) {
    res.render('signup')
})
router.post('/signup', function(req, res) {
    // console.log(req.body);
    // console.log(req.files);
    var avater = req.files.avater
    var filename = new Date().getTime() + avater.name.substr(avater.name.lastIndexOf('.'))
    var filepath = path.join(__dirname, '../public/avater/', filename)
        // console.log(filepath);
    avater.mv(filepath, function(err) {
        if (err) {
            console.log(err);
            res.send('注册异常')
        } else {
            req.body.avater = './avater/' + filename
            userDao.signup(req.body, function(err, r) {
                if (err) {
                    console.log(err);
                    res.send('注册异常')
                    return
                } else if (r.affectedRows > 0) {
                    // res.send('注册成功')
                    res.redirect('/posts')
                } else {
                    res.send('注册失败')
                }
            })
        }
    })
})
router.get('/create', function(req, res) {
    if (req.session.user)
        res.render('create')
    else
        res.redirect('/posts')
})
router.post('/create', function(req, res) {
    postDao.createPost(req.body.userid, req.body.title, req.body.content, function(err, r) {
        if (err) {
            console.log(err);
            return
        }
        if (r.affectedRows > 0) {
            res.send({ code: 200, status: 'success', msg: '发布成功' })
        } else {
            res.send({ code: 500, status: 'error', msg: '发布失败' })

        }
    })
})
router.post('/upload', function(req, res) {
    console.log(req.files);
    console.log(req.files.file);
    //返回JSON结果
    if (req.files.file) {
        var file = req.files.file
        var filename = new Date().getTime() + file.name.substr(file.name.lastIndexOf('.'))
        var filepath = path.join(__dirname, '../public/img/', filename)
        console.log(filename, filepath);
        file.mv(filepath, function(err) {

            res.send({
                "code": 0,
                "msg": "上传成功",
                "data": {
                    "src": "./img/" + filename
                }
            })
        })
    } else {
        res.send({
            "code": 1,
            "msg": "上传失败"
        })
    }
})
router.get('/edit', function(req, res) {
    // console.log(req.query.pid);
    if (req.session.user)
        postDao.findPostsById(req.query.pid, function(err, r) {
            if (err) {
                console.log(err);
                return
            }
            if (r.length > 0) {
                res.render('edit', { data: r[0] })
            } else {
                res.send({ code: 500, status: 'error', msg: '找不到文章' })
            }
        })
    else
        res.redirect('/posts')
})
router.post('/edit', function(req, res) {
    // console.log(req.body);

    postDao.modifyPost(req.body.title, req.body.content, req.body.id, function(err, r) {
        if (err) {
            console.log(err);
            return
        }
        // console.log(r);
        if (r.affectedRows > 0) {
            res.send({ code: 200, status: 'success', msg: '修改成功' })
        } else {
            res.send({ code: 500, status: 'error', msg: '找不到文章' })
        }
    })
})
module.exports = router;