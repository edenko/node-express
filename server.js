const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


/**************************************** 기본 설정 **************************************************/
var db;
MongoClient.connect('mongodb+srv://admin:0000009@cluster0.mwpuc.mongodb.net/todoapp?retryWrites=true&w=majority', function(error, client){
    if(error) return console.log(error);

    // db 연결
    db = client.db('todoapp');

    app.listen('8080', function(){
        console.log('listening on 8080')
    });
})

app.get('/pet', function(req, res) {
    res.send('펫용품 쇼핑할 수 있는 페이지입니다.');
});

app.get('/beauty', function(req, res) {
    res.send('안내문~!');
});

app.get('/', function(req, res) {
    // res.sendFile(__dirname + '/index.htmk');
    res.render('index.ejs');
});
/**************************************** 기본 설정 끝 **************************************************/


/**************************************** 게시물 CRUD **************************************************/
app.get('/write', (req, res) => {
    // res.sendFile(__dirname + '/write.html');
    res.render('write.ejs');
});

app.post('/add', function(req, res) {
    res.send('전송완료');
    db.collection('postCount').findOne({name : '게시물갯수'}, (error, result) => {
        var postAutoIncrement = result.totalPost;
        db.collection('post').insertOne({_id : postAutoIncrement + 1, title : req.body.title, date : req.body.date}, (error, result) => {
            console.log('성공');
            db.collection('postCount').updateOne({name : '게시물갯수'}, { $inc : {totalPost : 1}}, (error, result) => {
                if(error){return console.log(error)}
            });
        });
    });
});

app.get('/list', (req, res) => {
    db.collection('post').find().toArray((error, result) => {
        res.render('list.ejs', { posts : result });
    });
});

app.delete('/delete', (req, res) => {
    var id = parseInt(req.body._id);
    db.collection('post').deleteOne({_id : id} , (error, result) => {
        console.log('삭제됨');
        res.status(200).send({ message : '성공했습니다' });
        // res.status(400).send({ message : '실패했습니다' });
    });
});

app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (error, result) => {
        res.render('detail.ejs', { content : result });
    });
});

app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (error, result) => {
        res.render('edit.ejs', { content : result});
    })
});

app.patch('/edit/:id', (req, res) => {
   db.collection('post').updateOne({_id : parseInt(req.body._id)}, { $set : {title : req.body.title, date : req.body.date}}, (error, result) => {
       res.redirect('/list');
   });
});
/**************************************** 게시물 CRUD 끝 **************************************************/


/**************************************** 로그인 **************************************************/
app.get('/login', (req, res) => {
    res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}), (req, res) => {
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
    done(null, {})
});
/**************************************** 로그인 끝 **************************************************/


/**************************************** 마이페이지 **************************************************/
app.get('/myPage', loginCheck, (req, res) => {

    res.render('myPage.ejs');
});

function loginCheck(req, res, next) {
    if(req.user) {
        next()
    }else {
        // res.send('로그인 하세요')
        res.render('login.ejs');
    }
}
/**************************************** 마이페이지 끝 **************************************************/
