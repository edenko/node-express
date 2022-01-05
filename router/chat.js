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

/**************************************** chat **************************************************/

// router.get('/chat', loginCheck, (req, res) => {
//     db.collection('chatRoom').findOne({id : req.query.id, postUser: req.query.postUser, user: req.query.user}, (error, result) => {
//         if(result) {
//             res.render('chat.ejs', {chat : result})
//         }else {
//             res.render('chat.ejs')
//         }
//     })
// })
router.get('/chat', loginCheck, (req, res) => {
    db.collection('chatRoom').find({ user : req.user.id }).toArray().then((result) => {
        res.render('chat.ejs', {data : result, user : req.user})
    })
})

router.post('/chat', loginCheck, (req, res) => {
    db.collection('chatCount').findOne({name : '채팅갯수'}, (error, result) => {
        var chatAutoIncrement = result.totalChat;
        var data = {
            _id : chatAutoIncrement + 1,
            id : req.body.id,
            user : [req.body.user, req.body.postUser],
            date : req.body.date,
        };
        db.collection('chatRoom').insertOne(data, (error, result) => {
            db.collection('chatCount').updateOne({name : '채팅갯수'}, { $inc : {totalChat : 1}}, (error, result) => {
                if(error){return console.log(error)}
            });
            res.render('chat.ejs', {data : result})
        });
    })
})

router.post('/sendChat', loginCheck, (req, res) => {
    const today = new Date();
    var date = today.toISOString().substring(0, 10);
    var data = {
        parent : req.body.parent,
        content : req.body.content,
        postUser : req.body.postUser,
        user : req.user.id,
        date : date,
    }
    db.collection('chatLogs').insertOne(data).then(() => {
        console.log('채팅 저장 성공');
    }).catch(() => {

    })
})

router.get('/message/:parent', loginCheck, function(req, res){
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    db.collection('chatLogs').find({ parent : req.params.parent }).toArray().then((result)=>{
        res.write('event: test\n');
        res.write(`data: ${JSON.stringify(result)}\n\n`);
    })

    // change Stream
    const pipeline = [
        { $match: { 'fullDocument.parent' : req.params.parent } }
    ];
    const collection = db.collection('chatLogs')
    const changeStream = collection.watch(pipeline);
    changeStream.on('change', (result) => {
        console.log(result.fullDocument); // 전체 내용을 출력하고 싶다
        var data = [result.fullDocument];
        res.write('event: test\n');
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
});


module.exports = router;