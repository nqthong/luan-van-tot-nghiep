var client = require('./connection.js');

client.indices.putMapping({  
  index: 'gov',
  type: 'constituencies',
  body: {
    properties: {
      'constituencyname': {
        'type': 'string', // type is a required attribute if index is specified
        'index': 'not_analyzed'
      },
    }
  }
},function(err,resp,status){
    if (err) {
      console.log(err);
    }
    else {
      console.log(resp);
    }
});