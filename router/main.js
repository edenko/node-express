const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
require('dotenv').config();

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

/**************************************** 로그인, 세션 **************************************************/

router.get('/login', (req, res) => {
    res.render('login.ejs');
});

router.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}), (req, res) => {
    res.redirect('/')
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pwd',
    session: true,
    passReqToCallback: false,
}, function (inId, inPwd, done) {
    console.log(inId, inPwd);
    db.collection('users').findOne({ id: inId }, function (error, result) {
        if (error) return done(error)
        if (!result) return done(null, false, { message: '존재하지않는 아이디요' })
        if (inPwd == result.pwd) {
            return done(null, result)
        } else {
            return done(null, false, { message: '비번틀렸어요' })
        }
    })
}));

passport.serializeUser(function (user, done) {
    done(null, user.id)
});

passport.deserializeUser(function (id, done) {
    db.collection('users').findOne({id : id}, (error, result) => {
        done(null, result)
    })
});

router.post('/register', (req, res) => {
    db.collection('users').findOne({id: req.body.id}, (error, result) => {
        if (error) return done(error)
        if(!result) {
            db.collection('users').insertOne({id:req.body.id, pwd:req.body.pwd}, (error, result) => {
                if (error) return done(error)
            })
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write("<script>alert('가입되었습니다. 로그인해주세요.')</script>")
            res.end()
        }else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write("<script>alert('중복된 아이디 입니다.')</script>")
            res.end()
        }
        // res.redirect('/login')
    });
})

/**************************************** 로그인, 세션 끝 **************************************************/


/**************************************** 마이페이지 **************************************************/

router.get('/myPage', loginCheck, (req, res) => {
    // console.log(req.user);
    res.render('myPage.ejs', { user : req.user });
});

/**************************************** 마이페이지 끝 **************************************************/

module.exports = router;
