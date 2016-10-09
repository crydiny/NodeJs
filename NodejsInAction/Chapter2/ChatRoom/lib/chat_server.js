var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

exports.listen = function(server){
	io = socketio.listen(server);
	io.set('log level', 1);

	//定义每个用户连接的处理逻辑
	io.sockets.on('connection', function(socket){
		//用户连接上来时赋予其一个访客名.
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed);
		joinRoom(socket, 'Lobby');

		//处理用户的消息, 更名以及聊天室的创建和变更.
		handleMessageBroadcasting(socket, nickNames);
		handleNameChangeAttempts(socket, nickNames, namesUsed);
		handleRoomJoining(socket);

		//用户发出请求时, 向其提供已经被占用的聊天室的列表.
		socket.on('rooms', function(){
			socket.emit('rooms', io.sockets.manager.rooms);
		});

		//定义用户断开连接后的清除逻辑
		handleClientDisconnection(socket, nickNames, namesUsed);
	});
};


function assignGuestName(socket, guestNumber,nickNames, namesUsed){
	var name = 'Guest' + guestNumber;
	//把客户昵称和客户端连接ID关联上
	nickNames[socket.id] = name;
	//让用户知道他们的昵称
	socket.emit('nameResult', {
		success: true,
		name: name
	});
	namesUsed.push(name);
	return guestNumber + 1;
}


function joinRoom(socket, room){
	//让用户进入房间
	socket.join(room);
	//记录用户当前的房间
	currentRoom[socket.id] = room;
	//让房间其他用户知道他们进入了新的房间
	socket.emit('joinResult', {room: room});
	//让房间其他用户知道有新用户进来
	socket.broadcast.to(room).emit('message', {
		text: nickNames[socket.id] + 'had joined' + room + '.'
	});

	//确定有哪些用户在这个房间里
	var usersInRoom = io.sockets.clients(room);
	//如果不止一个用户, 汇总下都有谁.
	if(usersInRoom.length > 1){
		var usersInRoomSummary = 'Users currently in ' + room + ' : ';
		for(var i in usersInRoom){
			var userSocketId = usersInRoom[i].id;
			if(userSocketId != socket.id){
				if(i > 0){
					usersInRoomSummary += ', ';
				}
			}
			usersInRoomSummary += nickNames[userSocketId];
		}
		usersInRoomSummary += '.';
		//将房间里其他用户的汇总发给这个用户.
		socket.emit('message', {text: usersInRoomSummary});
	}
}


function handleNameChangeAttempts(socket, nickNames, namesUsed){
	//添加nameAttempt时间的监听器
	socket.on('nameAttempt', function(name){
		//昵称不能以Guest开头
		if(name.indexOf('Guest') === 0){
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".'
			});
		}else{
			//如果没有注册,就注册
			if(namesUsed.indexOf(name) === -1){
				var previousName = nickNames[socket.id];
				var previousNameIndex = namesUsed.indexOf(previousName);
				namesUsed.push(name);
				nickNames[socket.id] = name;
				delete namesUsed[previousNameIndex];
				socket.emit('nameResult', {
					success: true,
					name: name
				});
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				});
			}else{
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				});
			}
		}
	});
}

function handleMessageBroadcasting(socket){
	socket.on('message', function(message){
		socket.broadcast.to(message.room).emit('message', {
			text: nickNames[socket.id] + ':' + message.text
		});
	});
}

function handleRoomJoining(socket){
	socket.on('join', function(room){
		socket.leave(currentRoom[socket.id]);
		joinRoom(socket, room.newRoom);
	});
}

function handleClientDisconnection(socket){
	socket.on('disconnect', function(){
		var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
		delete namesUsed[nameIndex];
		delete nickNames[socket.id];
	});
}

