var express=require('express');
var app = express();
var http = require('http').Server(app);
var path = require ('path');

var chatServer = require('./lib/chat-server');
chatServer.listen(http);
app.use(express.static(path.join(__dirname,'public')));
http.listen(3000,function(){
console.log("Listening on port 3000");
});

//get Router file
app.get('/', function(req, res){
  res.sendFile(__dirname + '/views/index.html');
});

