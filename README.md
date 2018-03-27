# SocketChatApp
Chat App based on Advanced Nodejs using socketio

### Problem statement -
1. Create a simple one-to-one chat application using socket.io. This chat application
should also capture the events like “other user is typing”.
1. This chat application should also identify the user that it typing. It should have
login and logout feature, with proper notification to other user who is in the chat.
Something like “Sham has logged out”, “Sham has joined the chat etc”
1. The chat should be real time and using socket, but for storing the chat history
between two people. It should use mongodb. So, store the chat of users into
mongodb (along with their username) , so that this can be retrieved later by user
by scrolling up. (just like facebook messenger)
Hint - use nodejs events to store the chat. Don’t disturb the usual flow of
socket.io code by introduction mongoose save or any other mongoose function.
Perform these database calls in a separate nodejs event. This is how realtime
chat systems usually work.
