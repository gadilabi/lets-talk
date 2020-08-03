const express = require('express');
const socket = require('socket.io');
const {
    V4: uuidv4
} = require('uuid');

//App setup
const app = express();
const server = app.listen(3000, () => {

    console.log("listening on port 3000");

});


app.use(express.static('public'));

const io = socket(server);
const room = io.of('/:room');

room.on('connection', function (socket) {

    console.log('admin');

});

io.on('connection', function (socket) {

    socket.on('chat', function (data) {
        socket.broadcast.emit('chat', data);

    });

});

app.get("/get_id", (req, res) => {

    res.end(uuidv4());

});
