// Init
var express = require('express'), app = express();
var http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function() {
	app.use(express.static(__dirname + '/app'));
});
app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html')
});
server.listen(8080);
console.log("Server listening on port 8080");

var md5 = require('MD5');

var users = {};
var messages = [];
var history = 0;

// Socket.io
io.sockets.on('connection', function (socket) {
	var me = false;
	console.log('New user');

	// Login
	socket.on('login', function(user){
		me = user;
		me.name = user.username;
		for(var k in users){
			if(users[k].name == user.username){
				socket.emit('exist', user.username);
				return false;
			}
		}
		me.id = user.email.replace('@','-').replace('.','-');
		me.avatar = 'http://gravatar.com/avatar/'+md5(user.email)+'?s=50';
		socket.emit('logged', me);
		users[me.id] = me;
		socket.broadcast.emit('newusr', me);
	});

	// Send message
	socket.on('sendmsg', function(message){
		message.user = me;
		date = new Date();
		message.date = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'  '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		messages.push(message);
		if(messages.length > history){
			messages.shift();
		}
		io.sockets.emit('showmsg', message);
	});

	// Broadcast infos
	for(var k in users){
		socket.emit('newusr', users[k]);
	}
	for(var k in messages){
		socket.emit('showmsg', messages[k]);
	}

	// Disconnection
	socket.on('disconnect', function(){
		if(!me){
			return false;
		}
		delete users[me.id];
		io.sockets.emit('disusr', me);
	});
});