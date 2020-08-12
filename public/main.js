function main() {

	window.usersByRoom = [];

	//Connect to server
	window.socket = io.connect(`http://localhost:3000/`);
	//	window.socket.on('chat', function (data) {
	//		console.log(data);
	//		document.querySelector("app-chat").shadowRoot.querySelector("app-output").addMessage(data);
	//
	//	});


	window.rooms = JSON.parse(document.querySelector("app-menu").getAttribute("rooms")).rooms;

	window.socket.on('someone-join-room', function (data) {});


}



main();
