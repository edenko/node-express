const {MongoClient} = require("mongodb");
var router = require('express').Router();

var db;
MongoClient.connect(process.env.DB_URL, function(error, client){
    if(error) return console.log(error);
    db = client.db('todoapp');
})

function loginCheck(req, res, next) {
    if(req.user) {
        next()
    }else {
        res.render('login.ejs');
    }
}

/**************************************** 이미지 업로드 & 뷰 **************************************************/

let multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './public/image')
    },
    filename : function(req, file, cb){
        cb(null, file.originalname)
        // cb(null, file.originalname + new Date())
    },
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('PNG, JPG만 업로드하세요'))
        }
        callback(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
});

var upload = multer({storage : storage});

router.get('/upload', function(req, res){
    res.render('upload.ejs')
});

router.post('/upload', upload.single('profile'), (req, res) => {
    res.send('업로드 완료')
});

// router.get('/image/:imageName', (req, res) => {
//     res.sendFile(__dirname + '/../public/image/' + req.params.imageName)
// });

/**************************************** 이미지 업로드 & 뷰 끝 **************************************************/


module.exports = router;