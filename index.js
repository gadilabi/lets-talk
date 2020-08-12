const express = require('express');
const socket = require('socket.io');
const User = require("./classes/User.js");
const ejs = require('ejs');
const {
	v4: uuidv4
} = require('uuid');

//App setup
const app = express();
const server = app.listen(3000, () => {

	console.log("listening on port 3000");

});

app.use(express.static('public'));
app.set('view engine', 'ejs');

const io = socket(server);
const users = [];
const rooms = [];
const handlesByRoom = {};

io.on('connection', function (socket) {

	socket.on('create-room', function (data) {

		const room = data.roomName;
		socket.join(room);

		handlesByRoom[room] = [{
			handle: data.handle,
			id: socket.id
		}];

		socket.emit('users-list', handlesByRoom[room]);


		rooms.push(room);
		users.push(new User(socket.id, data.handle, data.roomName));

		socket.on('chat', function (data) {
			console.log(data);


			if (data.to === "everyone")
				socket.broadcast.to(room).emit('chat', data);
			else
				socket.to(data.to).emit('chat', data);
		});

	});

	socket.on('join-room', function (data) {

		const room = data.roomName;
		socket.join(room);
		handlesByRoom[room].push({
			handle: data.handle,
			id: socket.id
		});

		socket.emit('users-list', handlesByRoom[room]);


		users.push(new User(socket.id, data.handle, data.roomName));

		socket.broadcast.to(room).emit('someone-join-room', {
			handle: data.handle,
			id: socket.id
		});


		socket.on('chat', function (data) {
			console.log(data);

			if (data.to === "everyone")
				socket.broadcast.to(room).emit('chat', data);
			else
				socket.to(data.to).emit('chat', data);

		});


	});

	//	socket.on('disconnect', function () {
	//
	//		socket.emit('disconnected', {});
	//
	//		socket.on('remove', function (data) {
	//			handlesByRoom[data.room] = handlesByRoom[data.room].filter((entry) => entry.handle === data.handle);
	//			
	//			
	//
	//		});
	//
	//
	//	});


});

app.get('/', (req, res) => {

	const roomsJSON = JSON.stringify({
		rooms: rooms
	});
	res.render('index', {
		rooms: roomsJSON
	});

});


app.get("/get_id", (req, res) => {

	res.end(uuidv4());

});



app.get("/get_rooms", (req, res) => {

	res.json({
		rooms
	});

});
