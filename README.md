# lets-talk
This is a little video-chat web app.
Users can create rooms and send messages both publicly or privately to specific users in the room.
The app also allows video conversations between every two individuals in the room.

Technologically wise, the app uses node.js with express on the backend and vanilla js on the frontend.
The chat part of the app is based on web sockets, and I use the socket.io both on the server and the client.
The video part of the app was created with the native WebRTC api.
I used socket.io to also create the signaling server needed for the WebRTC protocol to establish the p2p connection between the users.
The frontend is created exclusively with web components.
 