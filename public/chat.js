////Create connection to ws on server
//const socket = io.connect("http://localhost:3000");
//
////User name
//const handle = document.querySelector("#handle");
//
////The message
//const message = document.querySelector("#message");
//
////The output
//const output = document.querySelector("#output");
//
////Send button
//const send = document.querySelector("#send");
//
//send.addEventListener("click", function (e) {
//
//    socket.emit("chat", {
//        message: message.value,
//        handle: handle.value,
//
//
//    });
//
//});
//
//socket.on('chat', function (data) {
//    output.innerHTML += '<p>' + data.handle + ":" + data.message;
//
//
//});