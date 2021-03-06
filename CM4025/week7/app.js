var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    nicknames = [];

app.use(express.static(__dirname + '/public'));

server.listen(8080);

app.get('/', function(req, res){
   console.log('index file requested')
   res.sendFile(__dirname+ '/views/index.html');
});

io.sockets.on('connection', function(socket){

   socket.on('new user', function(data, callback){
      if (nicknames.indexOf(data) != -1){
         callback(false);
      } else {
         callback(true);
         socket.nickname = data;
         nicknames.push(socket.nickname);
         io.sockets.emit('usernames', nicknames);
      }
   });

   socket.on('send message', function(data){
      io.sockets.emit('new message', {msg: data, nick: socket.nickname});
   });

   socket.on('disconnect', function(data){
      if(!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname),1);
      io.sockets.emit('usernames', nicknames);
   });
});