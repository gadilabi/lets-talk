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
//const room = io.of(/^\/\w+$/);

//room.on('connection', function (socket) {
//
//	socket.on('chat', function (data) {
//		socket.broadcast.emit('chat', data);
//
//		console.log(data);
//	});
//
//});

io.on('connection', function (socket) {

	socket.on('create-room', function (data) {

		const room = data.roomName;
		socket.join(room);

		handlesByRoom[room] = [data.handle];

		rooms.push(room);
		users.push(new User(socket.id, data.handle, data.roomName));

		socket.on('chat', function (data) {
			socket.broadcast.to(room).emit('chat', data);

		});

	});

	socket.on('join-room', function (data) {

		const room = data.roomName;
		socket.join(room);

		handlesByRoom[room].push(data.handle);
		users.push(new User(socket.id, data.handle, data.roomName));

		socket.broadcast.to(room).emit('someone-join-room', data);


		socket.emit('users-list', handlesByRoom[room]);

		socket.on('chat', function (data) {
			socket.broadcast.to(room).emit('chat', data);

		});


	});


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
