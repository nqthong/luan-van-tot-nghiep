const express = require('express');
const router = express.Router();
var url = require('url');
var bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch')
const Job = require('../models/job');



esClient = new elasticsearch.Client({ host: process.env.ES_URL } );

// UserRouter.route('/create').post(function (req, res) {
//   const user = new User(req.body);
//   user.save()
//     .then(user => {
//       res.json('User added successfully');
//     })
//     .catch(err => {
//       res.status(400).send("unable to save to database");
//     });
// });

router.get("/", (req, res) =>{
    
    var agg =[
        {$group:{
            _id:'$category2'
        }}
    ];

    Job.aggregate(agg, (err, job) =>{
        res.render('category', {jobs : job})
    })
})

//Category
router.get('/category?:category', (req, res)=>{
    var category = req.query.category;
    
    Job.find({ category2: {'$regex' : category, '$options' : 'i'}}, (err,job)=>{
        res.render('cv', {jobs : job})
    }).limit(15).sort({ createdOn: -1, "amount.amount": -1})
})

//vdu
// router.get('/vd', async (req, res, next) => {
//     Job.find().limit(10).sort({ "amount.amount": -1, createdOn: 1}).exec((err, job)=>{
//         res.render('vd', {jobs : job})
//     })
// })


router.get('/tk', (req,res, next)=>{
    res.render('search', {defaultLayout: 'main'})
})

router.post('/tk',(req,res)=>{
    var body = req.body;
    var query =  body.congviec ;
    //console.log(query);//{congveic:'duy'}
   
    Job.find( {$or: [
        {title : {'$regex' : query, '$options' : 'i'}},
        {category2:  {'$regex' : query, '$options' : 'i'}}]     
    }).limit(15).sort({ createdOn: -1, "amount.amount": -1}).exec((err, job)=>{
        res.render('cv', {jobs: job})
    })

})

router.get('/search?:ID', (req, res) =>{
    esClient.search({
        index: 'textstore' ,
        body: {
            query: {
                match: {
                    document:req.body.query
                }
            }
        }
    },
    function(err, respone, status ) {
        res.send(pagelist(respone.hits.hits));
    });
    var ID = req.query.ID;
    //var search = req.query.ID;
    Job.find({_id : ID},(err,job)=>{
        res.render('ctcv',{jobs : job})
    }).limit(15).sort({ createdOn: -1, "amount.amount": -1})

    });
    



// router.get('/advanced_search', (req,res, )=>{
//     var agg =[
//         {$group:{
//             _id:'$category2'
//         }}
//     ];

//     Job.aggregate(agg, (err, job) =>{
//         res.render('search_nc', {jobs : job})
//     })
// })

//advanced_search
router.post('/advanced_search', (req, res)=>{
    var search = req.body.search
    var tprice = req.body.tprice
    var ttype = req.body.ttype

    if(tprice === 'price_1'){
        Job.find({
            title : {'$regex' : search, '$options' : 'i'},
            "amount.amount" : { $lt : 100},
            category2: ttype 
        },(err,job)=>{
            res.render('cv',{jobs :job})
        })
    }else if(tprice ==='price_2'){
        console.log('Thanh cong')
        Job.find({
            title : {'$regex' : search, '$options' : 'i'},
            "amount.amount" : {$gte:100 , $lt : 250},
            category2: ttype        
        
        },(err,job)=>{
            res.render('cv',{jobs :job})
        })
    }else if(tprice ==='price_3'){
        Job.find({
            title : {'$regex' : search, '$options' : 'i'},
            "amount.amount" : {$gte:250 , $lt : 1000 },
            category2: ttype        
        
        },(err,job)=>{
            res.render('cv',{jobs :job})
        })
    }else if(tprice ==='price_4'){
        Job.find({
            title : {'$regex' : search, '$options' : 'i'},
            "amount.amount" : {$gte:1000 , $lt : 3000 },
            category2: ttype        
        
        },(err,job)=>{
            res.render('cv',{jobs :job})
        })
    }else{
        Job.find({
            title : {'$regex' : search, '$options' : 'i'},
            "amount.amount" : {$gte:3000 },
            category2: ttype        
        
        },(err,job)=>{
            res.render('cv',{jobs :job})
        }).limit(15).sort({createdOn: 1,"amount.amount": -1})
    }
})


module.exports = router;
