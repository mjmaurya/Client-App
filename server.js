var express=require('express')
var bodyParser=require('body-parser')
const { Socket } = require('dgram')
var app=express()
var http=require('http').Server(app)
var io=require('socket.io')(http)
var mongoose=require('mongoose')
var dbUrl='mongodb+srv://user:user@firstcluster.ys1ye.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

var Message=mongoose.model('Message',{
    name:String,
    message:String
})
// var messages=[
//     {name:"MJ",message:"hello  JM"},
//     {name:"JM",message:"hello  MJ"}

// ]

app.get('/messages',(req,res)=>{
    Message.find({},(err,messages)=>{
        res.send(messages)
    })
    
})

app.get('/messages/:user',(req,res)=>{
    var user=req.params.user
    Message.find({name:user},(err,messages)=>{
        res.send(messages)
    })
    
})

app.post('/messages',(req,res)=>{
    var message=new Message(req.body)
    message.save((err)=>{
        if(err)
            req.sendStatus(500)
        io.emit('message',req.body)
        res.sendStatus(200)
    })
})
io.on('connection',(socket)=>{
    console.log('User Connected')
})
mongoose.connect(dbUrl,(err)=>{
    console.log("Db connected",err)
    })
var server=http.listen(3000,()=>{
    console.log(server.address().port)
})