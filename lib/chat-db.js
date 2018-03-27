var mongoose = require('mongoose');

var dbPath='mongodb://localhost/chatStore';

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

  console.log("database connection open success");

});
//chat schema 
var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});// end chat schema model

var Chat = mongoose.model('Message', chatSchema); //mongoose model for chat

//retrieve messages from mongodb
exports.getOldMsgs = function(limit, cb){
	var query = Chat.find({});
	query.sort('-created').limit(limit).exec(function(err, docs){
		cb(err, docs);
		//console.log(docs);
	});
}//end retrieve messages from mongodb

//store messages to mongodb
exports.saveMsg = function(data, cb){
	var newMsg = new Chat({msg: data.msg, nick: data.nick});
	newMsg.save(function(err){
		cb(err);
	});
};//end store messages to mongodb