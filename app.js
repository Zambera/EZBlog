var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql')
var session = require('express-session')
var { v4: uuidv4 } = require('uuid')
var fileupload = require('express-fileupload')
var db = require('./db')
var indexRouter = require('./routes/index');
var articlesRouter = require('./routes/articles');
var usersRouter = require('./routes/users');
var houtaiRouter = require('./routes/houtai');

const { render } = require('ejs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    genid: function(req) {
        var sid = uuidv4()
        console.log('sessionid:' + sid);
        return sid
    },
    resave: false,
    secret: 'xxxx',
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))
var loginStatus = false;
app.post('/login', function(req, res, next) {
    db.query('select * from users where user_name=?', req.body.username, function(r, fields) {
        if (r.length > 0) {
            if (r[0].user_password == req.body.userpwd) {
                console.log(r);
                res.cookie('user', JSON.stringify(r[0]))
                res.send({ code: 1, msg: '登录成功', data: r[0] });
            } else {
                res.send({ code: 2, msg: '密码错误，请重新输入', data: {} });
            }
            console.log(r);
        } else {
            res.send({ code: 0, msg: '用户不存在，请注册', data: {} });
        }
    })
});
//定义一个拦截器 |中间件|过滤器
// app.use(function(req, res, next) {
//     if (req.url == '/login' || req.session.user) {
//         next(); //放行
//     } else {
//         res.redirect('/login')
//     }
// })
app.use(fileupload({
    limits: {
        fileSize: 50 * 1024 * 1024
    }
}))

app.post('/loginlong', function(req, res) {
    db.query('select * from users where user_name=?', req.body.username, function(r, fields) {

        if (r.length > 0) {
            if (r[0].user_password == req.body.userpwd) {

                req.session.user = r[0];
                req.session.remember = true;
                // console.log('session', req.session.user);
                loginStatus = true;
                res.send({ code: 1, msg: '登录成功', data: r[0] });

            } else {
                res.send({ code: 2, msg: '密码错误，请重新输入', data: {} });
            }
        } else {
            res.send({ code: 0, msg: '用户不存在，请注册', data: {} });
        }
    })
})
app.get('/setSession', function(req, res) {
    req.session.user = { id: 1, username: 'zs', password: '123456' }
    res.send('session savessssssd')
})

app.get('/readSession', function(req, res) {
    console.log('session', req.session.user);
    res.send(req.session.user)
})



app.use('/', indexRouter);
app.use('/articles', articlesRouter);
app.use('/users', usersRouter);
app.use('/houtai', houtaiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;