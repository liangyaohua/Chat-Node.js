window.onload = function(){
	// Init
	var socket = io.connect('http://localhost:8080');

	document.getElementById('chat').style.visibility = "hidden";
	document.getElementById('title').innerHTML = '';
	document.getElementById('messages').innerHTML = '';
	document.getElementById('users').innerHTML = '';
	document.getElementById('input').value = '';

	// Login
	document.getElementById('loginform').onsubmit = function(event){
		event.preventDefault();
		if (document.getElementById('username').value == "") {
			alert("Please enter a username");
			return false;
		} else if(document.getElementById('email').value == ""){
			alert("Please enter your email address");
			return false;
		} else {
			socket.emit('login', {
				username : document.getElementById('username').value,
				email	 : document.getElementById('email').value
			});
		}
	};

	// Username exist
	socket.on('exist', function(user){
		alert(user+' already exist, please choose another username');
	});

	// Logged
	socket.on('logged', function(user){
		document.getElementById('loginform').style.visibility = "hidden";
		document.getElementById('chat').style.visibility = "visible";
		document.getElementById('input').focus();
		document.getElementById('title').innerHTML = user.name;

		var newDiv1 = document.createElement('li');
		var newDiv2 = document.createElement('img');
		newDiv1.id = user.id;
		newDiv2.src = user.avatar;
		document.getElementById('users').appendChild(newDiv1);
		newDiv1.appendChild(newDiv2);
	});

	// New user
	socket.on('newusr', function(user){
		var newDiv1 = document.createElement('li');
		var newDiv2 = document.createElement('img');
		newDiv1.id = user.id;
		newDiv2.src = user.avatar;
		document.getElementById('users').appendChild(newDiv1);
		newDiv1.appendChild(newDiv2);
	});

	// Chat form
	document.getElementById('chatform').onsubmit = function(event){
		event.preventDefault();
		socket.emit('sendmsg', {message: document.getElementById('input').value});
		document.getElementById('input').value = '';
		document.getElementById('input').focus();
	};

	// Show message
	socket.on('showmsg', function(message){
		var objDiv = document.getElementById('messages');
		var newDiv1 = document.createElement('a');
		var newDiv2 = document.createElement('h5');
		var newDiv3 = document.createElement('span');
		var newDiv4 = document.createElement('small');
		var newDiv5 = document.createElement('p');

		newDiv1.href = "#";
		newDiv1.className = "list-group-item";
		newDiv1.id = "message";

		newDiv2.className = "list-group-item-heading";

		newDiv3.id = "pseudo";

		newDiv4.id = "time";

		newDiv5.className = "list-group-item-text";
		newDiv5.id = "text";

		objDiv.appendChild(newDiv1);
		newDiv1.appendChild(newDiv2);
		newDiv1.appendChild(newDiv5);
		newDiv2.appendChild(newDiv3);
		newDiv2.appendChild(newDiv4);
		newDiv3.appendChild(document.createTextNode(message.user.name));
		newDiv4.appendChild(document.createTextNode(message.date));
		newDiv5.appendChild(document.createTextNode(message.message));

		objDiv.scrollTop = 0;
	});

	// Disconnection
	socket.on('disusr', function(user){
		var element = document.getElementById(user.id);
		element.parentNode.removeChild(element);
	});
};