var express = require('express');
var router = express.Router();
const path = require('path');

//  /backend
router.get('/', function (req, res) {
    res.render('backend');
})
// backend/temp
router.get('/temp', function (req, res) {
    res.render('backend2');
})

//显示 文章的列表页面
router.all('/posts/list',function(req, res){
    res.render('postlist');
})

router.get('/upload', function (req, res) {
    res.render('upload')
})

router.post('/upload', function (req, res) {
    console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    var xx = req.files.xx;
    const uploadPath = path.join(__dirname, '../../public/uploads/', xx.name);
    xx.mv(uploadPath, function (err) {
        if (err)
            return res.status(500).send(err);
    });
    res.send('ok');
})

//其他表的路由
router.use('/user', require('./users'));

module.exports = router;
