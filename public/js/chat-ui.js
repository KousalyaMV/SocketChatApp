	var socket = io();
	// id of user that is being private messaged
	var userToPM = undefined;

	$('#choose-nickname').submit(function(e){
		e.preventDefault();
		var nick = $('#nickname').val();
		$('#userLog').html('<h4> UserName : ' + nick + '</h4>');
		socket.emit('choose nickname', nick, function(err){
			if (err) {
				$('#nick-error').text(err);
				$('#nickname').val('');
			} else {
				$('#nickname-container').hide();
				$('#chat-container').show();
			}
		});
	});
   //add or remove active users from page
	socket.on('names',function(users) {
		displayUsers(users);
	});//end add or remove active users from page

	//add or remove active users from page when login of a user
	socket.on('new user',function(user) {
		var html = "<span class='msg'><strong>" + user.nick + " logged in</strong>" ;
    	$('#chat').append(html);
		displayUsers([user]);
	});//end add or remove active users from page when login of a user

	//function to list users and on active user click open a div
	function displayUsers(users){
		var html = '';
		for (var i = 0; i < users.length; i++) {
			html += '<div class="user" id="user' + users[i].id + '">' + users[i].nick + '</div>';
		}
		$('#users').append(html);
	    $('.user').click(function(e){
	    	if (!userToPM) {
	    		$('#pm-col').show();
	    	}
	    	userToPM = $(this).attr('id').substring(4);
	    	$('#user-to-pm').html('<h2>Private Msg : ' + $(this).text() + '</h2>');
	    });
	}//end function to list users and on active user click open a div

	//on user disconnect remove user from active list and pop up message
	socket.on('user disconnect', function(id,nick){
		
		$('#user'+id).remove();
		var html = "<span class='msg'><strong>" + nick + " logged out</strong>" ;
    	$('#chat').append(html);
		
	});//end on user disconnect remove user from active list and pop up message
	
	// message send click event, emit message to all user
    $('#send-message').submit(function(e){
        e.preventDefault();
        var msg = $('#new-message').val();
        socket.emit('message', msg);
        $('#new-message').val('');
    });//end message send click event, emit message to all user

    socket.on('message', function(data){
    	displayMsg(data.msg, data.nick)
    });

    socket.on('load old msgs', function(docs){
    	for (var i = docs.length-1; i >= 0; i--) {
    		displayMsg(docs[i].msg, docs[i].nick);
    	}
    });
	//when message emitted display in screen
    function displayMsg(msg, nick){
    	var html = "<span class='msg'><strong>" + nick + ":</strong> " + msg;
    	$('#chat').append(html);
    }//end when message emitted display in screen
  
    //private message send click event emit message to particular user
    $('#send-pm').submit(function(e){
    	e.preventDefault();
    	socket.emit('private message', {msg: $('#new-pm').val(), userToPM: userToPM});
    	$('#new-pm').val('');
    });//end private message send click event emit message to particular user
    
	//emit the private message in their screen who sent
    socket.on('private message', function(data){
    	var html = "<span class='pMsg'><strong>" + data.from + ":</strong> " + data.msg;
    	$('#chat').append(html);
    });//end emit the private message in their screen who sent
