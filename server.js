var express = require('express')
var bodyParser = require('body-parser')
// create an instance of express
var app = express()
var http = require('http').Server(app)
// pass in a reference to http
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = 'mongodb://user:pass420@ds151393.mlab.com:51393/learning-node'

var Message = mongoose.model('Message', {
  name: String,
  message: String
})

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    res.send(messages)
  })
})

app.post('/messages', async (req, res) => {

  try {
    throw 'some error'
    var message = new Message(req.body)

    // message.save will return a value when it finishes and store it in savedMessage
    var savedMessage = await message.save()
  
    console.log('saved')
      
    var censored = await Message.findOne({message: 'badword'})

    if(censored) 
      // return was replaced with await
      await Message.deleteOne({_id: censored.id})
    else
    // if no error...
    // announce to the client that there's a new message
      io.emit('message', req.body)

    res.sendStatus(200)

  } catch (error) {
    res.sendStatus(500)
    return console.error(error)
  } finally {
    console.log('a message was sent')
  }
})

// this callback will let us know when a new user connects
io.on('connection', (socket) => {
  console.log('a user connected')
})

mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
  console.log('mongo db connection', err)
})

// port 3000
var server = http.listen(3000, () => {
  console.log('server is listening on port', server.address().port)
})