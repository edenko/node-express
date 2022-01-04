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

/**************************************** 게시물 CRUD **************************************************/

router.get('/write', loginCheck, (req, res) => {
    // res.sendFile(__dirname + '/write.html');
    res.render('write.ejs', { user : req.user });
});

router.post('/add', function(req, res) {
    db.collection('postCount').findOne({name : '게시물갯수'}, (error, result) => {
        var postAutoIncrement = result.totalPost;
        var data = {_id : postAutoIncrement + 1, title : req.body.title, date : req.body.date, user : req.user.id};
        db.collection('post').insertOne(data, (error, result) => {
            db.collection('postCount').updateOne({name : '게시물갯수'}, { $inc : {totalPost : 1}}, (error, result) => {
                if(error){return console.log(error)}
            });
        });
    });
    res.redirect('/board/list')
});

router.get('/list', (req, res) => {
    db.collection('post').find().toArray((error, result) => {
        // res.send({ posts : result, user : req.user });
        res.render('list.ejs', { posts : result, user : req.user });
    });
});

router.delete('/delete', (req, res) => {
    var id = parseInt(req.body._id);
    var data = {_id : id, user : req.user.id};
    db.collection('post').deleteOne(data , (error, result) => {
        console.log('삭제됨');
        res.status(200).send({ message : '성공했습니다' });
        // res.status(400).send({ message : '실패했습니다' });
    });
});

router.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (error, result) => {
        res.render('detail.ejs', { content : result });
    });
});

router.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (error, result) => {
        res.render('edit.ejs', { content : result});
    })
});

router.patch('/edit/:id', (req, res) => {
    db.collection('post').updateOne({_id : parseInt(req.body._id)}, { $set : {title : req.body.title, date : req.body.date}}, (error, result) => {
    });
    res.redirect('/board/list');
});

/**************************************** 게시물 CRUD 끝 **************************************************/


/**************************************** 검색 **************************************************/

// app.get('/search', (req, res) => {
//     db.collection('post').find({ $text: { $search: req.query.value } }).toArray((error, result) => {
//         console.log(result);
//         res.render('search.ejs', {posts : result})
//     })
// })
router.get('/search', (req, res) => {
    var searchCondition = [
        {
            $search: {
                index: 'titleSearch',
                text: {
                    query: req.query.value,
                    path: 'title'  // 제목 날짜 둘다 찾고 싶으면 ['title', 'date']
                }
            }
        },
        {
            $sort : {
                _id : -1 // 1 : asc, -1 : desc
            }
        },
        {
            $limit : 10
        },
        {
            $project: {
                title : 1, _id : 0, score : { $meta : "searchScore" }
            }
        }
    ];
    // console.log(req.query);
    db.collection('post').aggregate(searchCondition).toArray((error, result) => {
        console.log(result);
        res.render('search.ejs', {posts : result})
    })
})

/**************************************** 검색 끝 **************************************************/


module.exports = router;
