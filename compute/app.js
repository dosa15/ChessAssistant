var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
   res.sendFile(__dirname+'/index.html');});
users = [];
io.on('connection', function(socket){
   console.log('A client is connected');
   socket.on('setUsername', function(data){
      console.log(data);
      if(users.indexOf(data) > -1){
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   moves=[];
   count=0;
   socket.on('msg', function(data){
      //Send message to everyone
	  if(users.length==3 && count>=2){
		count=count+1;
		moves.push(data.message);
		console.log("Received moves", moves);
		pos=Math.floor(Math.random() * count);
		console.log("Best move ", moves[pos]);
	  }
	  else{
		console.log("Not enough clients/moves");
		count=count+1;
		moves.push(data.message);
	  }
	
      io.sockets.emit('newmsg', data);
   })
});
http.listen(3000, function(){
   console.log('listening on localhost:3000');
});