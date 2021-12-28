const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bodyParser= require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
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

    app.listen(process.env.PORT, function(){
        console.log('listening on 8080')
    });
})

app.get('/', function(req, res) {
    // res.sendFile(__dirname + '/index.htmk');
    res.render('index.ejs');
});


/**************************************** router **************************************************/
app.use('/', require('./router/main'));
app.use('/board', require('./router/board'));
