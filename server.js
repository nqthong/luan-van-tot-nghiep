const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs  = require('express-handlebars')
const elasticsearch = require('elasticsearch')
const fs = require('fs');
const verify = require('./verify');
const mongoosastic = require('mongoosastic')


var app = express();

app.use(express.static(__dirname + '/public'))


//connect mongoose
const config = require('./public/db');
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);


//express-handlebars
app.engine('.hbs', exphbs({extname: '.hbs', defaultLayout: 'main'} ));
app.set('view engine', '.hbs');


//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Create Express routes
const indexRoute = require('./routes/indexRouter')
app.use(indexRoute)

 const client = new elasticsearch.Client({
     host: '127.0.0.1:9200/db_upwork',
     log: 'error'
       });
       client.search({  
        index: 'gov',
        type: 'constituencies',
        body: {
          query: {
            match: { "constituencyname": "Harwich" }
          },
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
            console.log("--- Response ---");
            console.log(response);
            console.log("--- Hits ---");
            response.hits.hits.forEach(function(hit){
              console.log(hit);
            })
          }
      });
    //    client.search({
    //     index: 'twitter', 
    //     type: 'tweets', 
    //     body: { 
    //         query: { match: { body: 'elasticsearch' } }
    //     }
    // }).then(function (resp) {
    //     var hits = resp.hits.hits;
    // },  function (err) {
    //     console.trace(err.message);
    // });
//  client.ping({ requestTimeout: 30000 }, function(error) {
//     if (error) {
//       console.error('elasticsearch cluster is down!');
//    } else {
//          console.log('Everything is ok');
//     }
//  });


// const bulkIndex = function bulkIndex(index, type, data) {
//     let bulkBody = [];
  
//     data.forEach(item => {
//       bulkBody.push({
//         index: {
//           _index: index,
//           _type: type,
//           _id: item.id
//         }
//       });
  
//       bulkBody.push(item);
//     });
  
// client.bulk({body: bulkBody})
//     .then(response => {
//       let errorCount = 0;
//       response.items.forEach(item => {
//         if (item.index && item.index.error) {
//           console.log(++errorCount, item.index.error);
//         }
//       });
//       console.log(
//         `Successfully indexed ${data.length - errorCount}
//          out of ${data.length} items`
//       );
//     })
//     .catch(console.err);
//   };

// async function indexData() {
//     const articlesRaw = await fs.readFileSync('./data.json');
//     const articles = JSON.parse(articlesRaw);
//     console.log(`${articles.length} items parsed from data file`);
//     bulkIndex('library', 'article', articles);
//   };

// indexData();
// verify();

//create the HTTP server
app.set('port', process.env.PORT || 2000);
app.listen(app.get('port'), ()=>{
    console.log('Express start on http://localhost:2000')
});