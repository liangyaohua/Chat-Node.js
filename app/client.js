window.onload = function(){
	// Init
	var socket = io.connect('http://localhost:8080');

	$('#chat').hide();
	$('#title').html('');
	$('#messages').html('');
	$('#users').html('');
	$('#input').val('');

	// Login
	$('#loginform').submit(function(event){
		event.preventDefault();
		if ($('#username').val() == '') {
			alert("Please enter a username");
			return false;
		} else if($('#email').val() == ''){
			alert("Please enter your email address");
			return false;
		} else {
			socket.emit('login', {
				username : $('#username').val(),
				email	 : $('#email').val()
			});
		}
	});

	// Username exist
	socket.on('exist', function(user){
		alert(user+' already exist, please choose another username');
	});

	// Logged
	socket.on('logged', function(user){
		$('#loginform').hide();
		$('#chat').fadeIn();
		$('#input').focus();
		$('#title').html(user.name);
		$('#users').append('<li id="'+user.id+'"><img src="'+user.avatar+'"></img></li>');
	});

	// New user
	socket.on('newusr', function(user){
		$('#users').append('<li id="'+user.id+'"><img src="'+user.avatar+'"></img></li>');
	});

	// Chat form
	document.getElementById('chatform').onsubmit = function(event){
		event.preventDefault();
		socket.emit('sendmsg', {message: $('#input').val()});
		$('#input').val('');
		$('#input').focus();
	};

	// Show message
	socket.on('showmsg', function(message){
		$('#messages').append('<a href="#" class="list-group-item" id="message"><h5 class="list-group-item-heading"><span id="pseudo">'+message.user.name+'</span><small id="time">'+message.date+'</small></h5><p class="list-group-item-text" id="text">'+message.message+'</p></a>');
		$('#messages').scrollTop(0);
	});

	// Disconnection
	socket.on('disusr', function(user){
		$('#'+user.id).remove();
	});
};