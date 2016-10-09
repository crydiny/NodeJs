function divEscapedConentElement(message){
	return $('<div></div>').text(message);
}

function divSystemConentElement(message){
	return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket){
	var message = $('#send-message').val();
	var systemMessage;

	if(message.charAt(0) === '/'){
		systemMessage = chatApp.processCommand(message);
		if(systemMessage){
			$['#message'].append(divSystemConentElement(systemMessage));
		}
	}else{
		chatApp.sendMessage($('#room').text(), message);
		$('#messages').append(divEscapedConentElement(message));
		$('#messages').scrollTop($('#messages').prop('scrollHeight'));
	}

	$('#send-message'.val(''));
}


var socket = io.connect();

$(document).ready(function(){
	var chatApp = new Chat(socket);

	//显示更名尝试的结果
	socket.on('nameResult', function(result){
		var message;
		if(result.sucess){
			message = 'You are now known as ' + result.name +'.';
		}else{
			message = result.message;
		}
		$('#messages').append(divSystemConentElement(message));
	});

	//显示房间变更结果
	socket.on('joinResult', function(result){
		$('#room').text(result.room);
		$('#messages').append(divSystemConentElement('Room changed.'));
	});

	//显示接收到的消息
	socket.on('message', function(message){
		var newElement = $('<div></div>').text(message.text);
		$('#messages').append(newElement);
	});

	//显示可用房间列表
	socket.on('rooms', function(rooms){
		$('#room-list').empty();

		for(var room in rooms){
			room = room.substring(1, room.length);
			if(room !== ''){
				$('#room-list').append(divEscapedConentElement(room));
			}
		}

		//点击房间名可以换到那个房间中
		$('#room-list div').click(function(){
			chatApp.processCommand('/join' + $(this).text());
			$('#send-message').focus();
		});
	});

	//定期请求可用房间列表
	setInterval(function(){
		socket.emit('rooms');
	}, 1000);

	$('#send-message').focus();

	//提交表单可以发送聊天消息
	$('#send-form').submit(function(){
		processUserInput(chatApp, socket);
		return false;
	});
});
