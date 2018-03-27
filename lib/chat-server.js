var socketio = require('socket.io');
var db = require('./chat-db'); //mongodb schema
var io ;
// maps socket.id to user's nickname
var nicknames = {};
// list of socket ids
var clients = [];
var namesUsed = [];

exports.listen = function(server){
  io = socketio.listen(server);
  io.on('connection', function(socket){
    initializeConnection(socket);
    handleChoosingNicknames(socket);
    handleClientDisconnections(socket);
    handleMessageBroadcasting(socket);
    handlePrivateMessaging(socket);	
  });
}
//fetch Active users load on login
function initializeConnection(socket){
  showActiveUsers(socket);
  showOldMsgs(socket);
}//end fetch Active users load on login

//get list of active users in room
function showActiveUsers(socket){
  var activeNames = [];
  var usersInRoom =Object.keys(io.sockets.sockets);
   usersInRoom.forEach(function(id){ 
    var userSocketId = 	id;
    if (userSocketId !== socket.id && nicknames[userSocketId]){
      var name = nicknames[userSocketId];
      activeNames.push({id: namesUsed.indexOf(name), nick: name});
    }
	}); 
  socket.emit('names',activeNames);
}//end get list of active users in room

//emit old message to server
function showOldMsgs(socket){
  db.getOldMsgs(100, function(err, docs){
    socket.emit('load old msgs', docs);
  });
}//end emit old message to server

//check if user already login
function handleChoosingNicknames(socket){
  socket.on('choose nickname', function(nick, cb) {
    if (namesUsed.indexOf(nick) !== -1) {
      cb('That name is already taken!  Please choose another one.');
      return;
    }
    var ind = namesUsed.push(nick) - 1;
    clients[ind] = socket;
    nicknames[socket.id] = nick;
    cb(null);
    io.sockets.emit('new user',{id: ind, nick: nick});
  });
}// end check if user already login

// emit and save messgage sent
function handleMessageBroadcasting(socket){
  socket.on('message', function(msg){
    var nick = nicknames[socket.id];
    db.saveMsg({nick: nick, msg: msg}, function(err){
      if(err) throw err;
      io.sockets.emit('message', {nick: nick, msg: msg});
    });
  });
}// end emit and save messgage sent

//emit private message to ToUser
function handlePrivateMessaging(socket){
  socket.on('private message', function(data){
    var from = nicknames[socket.id];
    clients[data.userToPM].emit('private message', {from: from, msg: data.msg});
  });
}//end emit private message to ToUser

//on disconnect remove user from socket 
function handleClientDisconnections(socket){
  socket.on('disconnect', function(){
    var ind = namesUsed.indexOf(nicknames[socket.id]);
	io.sockets.emit('user disconnect',ind, nicknames[socket.id]);
    delete namesUsed[ind];
    delete clients[ind];
    delete nicknames[socket.id];
    
  });
}//end on disconnect remove user from socket 
  

