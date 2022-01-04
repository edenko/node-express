const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const http = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(session({secret : 'secret', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


var db;
MongoClient.connect(process.env.DB_URL, function(error, client){
    if(error) return console.log(error);

    // db 연결
    db = client.db('todoapp');

    http.listen(process.env.PORT, function(){
        console.log('listening on 8080')
    });
})

app.get('/', function(req, res) {
    // res.sendFile(__dirname + '/index.htmk');
    res.render('index.ejs', {user : req.user});
});

app.get('/image/:imageName', (req, res) => {
    res.sendFile(__dirname + '/public/image/' + req.params.imageName)
});

/**************************************** web socket **************************************************/
app.get('/socket', (req, res) =>  {
    res.render('socket.ejs')
})

// 누가 웹소켓에 접속하면 연결해주세요
io.on('connection', function(socket) {
    socket.on('join-room1', (data) => {
        // 채팅방 생성 + 유저 생성
        socket.join('room1')
    });
    socket.on('room1-send', (data) => {
        io.to('room1').emit('broadcast', data)
    });

    socket.on('join-room2', (data) => {
        // 채팅방 생성 + 유저 생성
        socket.join('room2')
    });
    socket.on('room2-send', (data) => {
        io.to('room2').emit('broadcast', data)
    });

    socket.on('user-send', (data) => {
        io.emit('broadcast', data)
    });
})

/**************************************** router **************************************************/
app.use('/', require('./router/main'));
app.use('/', require('./router/upload'));
app.use('/', require('./router/chat'));
app.use('/board', require('./router/board'));
