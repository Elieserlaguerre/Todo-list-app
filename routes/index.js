const express = require('express')
const router = express.Router()
const sanitizeHTML = require('sanitize-html')

// const db = require('../public/javascript/_mongodbConnection.js');

const { MongoClient } = require('mongodb')
const mongodb = require('mongodb')

let db

let connectionString =
  'mongodb+srv://ElieserLaguerre:DeveloperEli@cluster0.aqrs3.mongodb.net/TodoApp?retryWrites=true&w=majority'
MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, client) => {
    if (err) {
      console.log(err)
    } else {
      db = client.db()
      console.log('connection successful')
    }
  }
)

const passwordProtected = (req, res, next) => {
  res.set('www-Authenticate','Basic realm = "Simple Todo App"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == "Basic ZWxpOjEyMw==") {
    next()    
  } else {
    res.status(401).send("Authentication required")
  }
}

router.use(passwordProtected)

/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    db.collection('items')
      .find()
      .toArray((err, items) => {
        if (err) {
          console.log(err)
        } else {
          res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action="/create-item" method="POST" >
        <div class="d-flex align-items-center">
          <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">    
      
    </ul>
    
  </div>
<script>
  let items = ${JSON.stringify(items)}
</script>
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  <script src="/javascripts/browser.js"></script>
</body>
</html>`)
        }
      })
  } catch (err) {
    console.error(err)
  }
})

router.post('/create-item', (req, res, next) => {
  try {
    let safeText = sanitizeHTML(req.body.text,{allowedTags: [], allowedAttributes: {}})
    db.collection('items').insertOne({ text: safeText }, (err, info) => {
      if (err) {
        console.log(err)
      } else {
        let data = {
          _id: info.insertedId,
          text: req.body.text
        }
        res.json(data)
      }
    })
  } catch (err) {
    console.error(err)
  }
})

router.post('/update-item', (req, res, next) => {
  try {
  let safeText = sanitizeHTML(req.body.text, {
  allowedTags: [],
  allowedAttributes: {}
})

    db.collection('items').findOneAndUpdate(
      { _id: new mongodb.ObjectId(req.body.id) },
      { $set: { text: safeText } },
      () => {
        res.send('Success')
      }
    )
  } catch (err) {
    console.log(err)
  }
})

router.post('/delete-item', (req, res, next) => {
  try {
    db.collection('items').deleteOne(
      {
        _id: new mongodb.ObjectId(req.body.id)
      },
      () => {
        res.send('Success')
      }
    )
  } catch (err) {}
})

module.exports = router
