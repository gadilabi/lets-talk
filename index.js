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
const handlesByRoom = {};

io.on('connection', function (socket) {

	socket.on('enter-room', function (data) {

		const room = data.roomName;
		socket.join(room);

		if (!Object.keys(handlesByRoom).includes(room)) {

			handlesByRoom[room] = [{
				handle: data.handle,
				id: socket.id
			}];

		} else {

			handlesByRoom[room].push({
				handle: data.handle,
				id: socket.id
			});

			socket.broadcast.to(room).emit('someone-join-room', {
				handle: data.handle,
				id: socket.id
			});

		}

		socket.emit('users-list', handlesByRoom[room]);

		socket.on('chat', function (data) {
			console.log(data);


			if (data.to === "everyone")
				socket.broadcast.to(room).emit('chat', data);
			else
				socket.to(data.to).emit('chat', data);
		});

		socket.on('disconnect', function () {

			//Remove user from room
			handlesByRoom[room] = handlesByRoom[room].filter((user) => user.id !== socket.id);

			//Broadcast id of disconnected user
			socket.broadcast.to(room).emit('disconnected', socket.id);
		});

		socket.on('offer', (msg) => {
			const {
				type,
				from,
				to
			} = msg;
			console.log({
				type,
				from,
				to
			});

			socket.to(msg.to.id).emit('offer', msg);


		});

		socket.on('answer', (msg) => {
			const {
				type,
				from,
				to
			} = msg;
			console.log({
				type,
				from,
				to
			});
			socket.to(msg.to.id).emit('answer', msg);

		});

		socket.on('new-ice-candidate', (msg) => {

			socket.to(msg.to.id).emit('new-ice-candidate', msg);

		});

		socket.on('hang-up', (payload) => {

			socket.to(payload.toId).emit('hang-up', {
				from: payload.fromHandle
			});

		});


	});

});

app.get('/', (req, res) => {

	const roomsJSON = JSON.stringify({
		rooms: Object.keys(handlesByRoom)
	});
	res.render('index', {
		rooms: roomsJSON
	});

});


app.get("/get_id", (req, res) => {

	res.end(uuidv4());

});



app.get("/get_rooms", (req, res) => {

	const rooms = Object.keys(handlesByRoom);

	res.json({
		rooms
	});

});
