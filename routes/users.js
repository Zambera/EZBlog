var express = require('express');
var db = require('../db');
var cookieParser = require('cookie-parser');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//新增

router.get('/register', function(req, res, next) {
    res.render('user/register');
});
router.post('/register', function(req, res, next) {
    console.log(req.body);
    db.query('insert into users(user_name,user_password,user_email,user_nickname,role) values(?,?,?,?,?)', [req.body.uname, req.body.upwd, req.body.uemail, req.body.unick, 2], function(r, fields) {
        if (r.affectedRows > 0) {
            res.send('注册成功')
        } else {
            res.send('注册失败');
        }
    })
});


router.post('/add', function(req, res) {
    //获取post请求的数据
    db.query('insert into user(username,userpsw,status,role) values(?,?,?,?)', [req.body.username, req.body.userpsw, req.body.status, req.body.role], function(r, fields) {
        if (r.affectedRows > 0) {
            res.send('添加成功')
        } else {
            res.send('添加失败');
        }
    })
})

//显示修改的页面  GET / users/update
router.get('/update', function(req, res) {
    //res.render('模板名字',模板数据)
    //select * from user where id= +req.query.id
    db.query('select * from user where id=?', req.query.id, function(r, fields) {
        if (r.length > 0) {
            res.render('user/update', r[0])
        } else {
            res.send('id不存在');
        }
    })

});
//处理修改的内容  POST  /users/update
router.post('/update', function(req, res) {
    db.query('update user set username=?,userpsw=? where id=?', [req.body.username, req.body.userpsw, req.body.id], function(r, fields) {
        res.statusCode = 200;
        if (r) {
            if (r.affectedRows > 0) {
                // res.send('success')
                res.redirect('/users/list')
            } else {
                res.send('Fail');
            }

        }
    })
});
router.get('/list', function(req, res) {
    //select * from user
    var userList;
    db.query("SELECT id,username,role,status,DATE_FORMAT(create_time,'%Y-%m-%d %h:%i:%s') create_time FROM user", [], function(r, fields) {
        userList = r;
        res.render('user/list', { list: userList });
    })

});
router.post('/list', function(req, res) {
    //select * from user

    var userList = [];
    var userList = [];
    db.query("select id,username,role,status,DATE_FORMAT(create_time,'%Y-%m-%d %h:%i:%s') create_time from user where username like ?", '%' + req.body.username + '%', function(r, fields) {
        userList = r;
        res.render('user/list', { list: userList })
    })



    // if (req.body.username) {
    //     for (var i = 0; i < userList.length; i++) {
    //         if (userList[i].username.indexOf(req.body.username) >= 0) {
    //             newList.push(userList[i]);
    //         }
    //     }
    // } else {
    //     newList = userList;
    // }
    // res.render('user/list', { list: newList });
});
router.get('/del', function(req, res) {
    var userlist = [];
    db.query("delete from user where id=?", req.query.id, function(r, fields) {
            if (r.affectedRows > 0) {
                console.log('删除成功');
                res.redirect('/users/list')
            } else {
                res.send('删除失败')
            }
        })
        // db.query("select * from user", [], function(r, fields) {
        //     // if (r.length > 0) {
        //     //     console.log(r);
        //     // }
        //     userList = r;
        //     res.render('user/list', { list: userList });
        // })

});
router.get('/check', function(req, res) {
    if (req.query.username == 'abc') {
        res.send('error')
    } else {
        res.send('success')
    }
})
module.exports = router;