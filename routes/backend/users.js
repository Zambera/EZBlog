var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//  backend/user/list
router.get('/list', function(req, res) {
    //userlist.ejs
    res.render('userlist');
})

module.exports = router;