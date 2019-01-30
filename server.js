var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require(`http`).Server(app)
var io = require(`socket.io`)(http)
var mongoose = require(`mongoose`)

const PORT = 3000 || process.env.PORT;

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var dbUrl = `mongodb://user:Kaviya.98@ds117145.mlab.com:17145/node-app`

var Message = mongoose.model(`Message`, {
    name: String,
    message: String
})

var messages = [
    {name:`tim`, message:`Hi`},
    {name:`toms`, message:`Hola`}
]

app.get(`/messages`, (req, res) =>{
    Message.find({}, (err, messages) =>{
        res.send(messages)
    })
    
})

app.post(`/messages`, (req, res) =>{
var message = new Message(req.body)

    message.save((err) => { 
        if(err)
            sendStatus(500)

            Message.findOne({message: `badword`}, (err, censored) =>{
                if(censored){
                    console.log(`censored words found`, censored)
                    Message.remove({_id: censored.id}, (err) =>{
                        console.log(`removed censored message`)
                    })
                }
            })

            console.log(req.body)
            messages.push(req.body)
            io.emit(`message`, req.body)
            res.status(200).json({ success: true, message: req.body });
    })
    
})

io.on(`connection`, (socket) => {
    console.log(`a user connected`)
})

mongoose.connect(dbUrl, {useMongoClient: true}, (err) => {
    console.log(`mongo db connection`, err)
})

http.listen(PORT, err => {
    if(err){
        return console.log(`Could not start server application on port ${PORT}`);
    }

    console.log(`Server application started on port ${PORT}`);
});