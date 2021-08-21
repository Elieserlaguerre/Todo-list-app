const { MongoClient } = require('mongodb');

let db;

let connectionString = 'mongodb+srv://ElieserLaguerre:vokJbO0dOvgmZR8Y@cluster0.aqrs3.mongodb.net/TodoApp?retryWrites=true&w=majority'
MongoClient.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
 if (err) {
 console.log(err);     
 } else {
 db = client.db()  
 console.log('connection successful');   
 }
})

export default 