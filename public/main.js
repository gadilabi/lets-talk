//CREATE THE VIDEO ELEMENTS FROM THE BEGIGING
const constraints = {
	video: true,
	audio: true
};

//A list of objects {handle, id}
window.usersByRoom = [];

//The handle of the user
window.handle = null;

//A list of the handles in the room
window.handles = null;

//Connect to server
if (window.location.href === "http://localhost:3000/")
	window.socket = io.connect(`http://localhost:3000/`);
else
	window.socket = io.connect(`https://letsstarttalking.herokuapp.com/`);
window.rtcConnectionsByHandle = {};

window.stunServers = {
	iceServers: [{
		urls: "stun:stun.l.google.com:19302"
	}]
};

function requestCallPrompt(msg) {

	const fromId = msg.fromId;
	const fromHandle = msg.fromHandle;
	const to = msg.to;


	const event = new CustomEvent('video-call-request', {

		bubbles: true,
		composed: true,
		detail: {
			fromId,
			fromHandle,
			to
		}
	});

	document.querySelector("app-chat").dispatchEvent(event);


}

window.socket.on('video-call-request', (msg) => {

	requestCallPrompt(msg);

	window.socket.emit('video-call-answer', msg);


});

window.socket.on('video-call-answer', (msg) => {

	console.log(msg);

	if (msg.pickedUp)
		//Initiate the RTC connection with current partner as the caller (thus active)
		establishConnection(window.partner, "active");


});

window.socket.on('hang-up', (msg) => {

	console.log("receive hang up");
	const from = msg.from;

	console.log(window.rtcConnectionsByHandle[from]);

	window.rtcConnectionsByHandle[from].close();
	console.log(window.rtcConnectionsByHandle[from]);

	window.rtcConnectionsByHandle[from] = null;

	fireHangUpEvent(from);

});


window.socket.on('answer', (e) => {

	const remoteHandle = e.from.handle;
	const sdp = e.sdp;

	let desc = new RTCSessionDescription(e.sdp);
	window.rtcConnectionsByHandle[remoteHandle].setRemoteDescription(desc).
	catch(err => console.log(err));

});

window.socket.on('new-ice-candidate', (e) => {

	//Extract the handler of peer
	const remoteHandler = e.from.handle;

	//Create a candidate object
	const candidate = new RTCIceCandidate(e.candidate);

	if (rtcConnectionsByHandle[remoteHandler]) {
		//Add candidate to connection
		rtcConnectionsByHandle[remoteHandler].addIceCandidate(candidate)
			.catch(err => console.log(err));

	}


});


window.socket.on("offer", async (e) => {

	//Extract the variables from the message
	const remoteHandle = e.from.handle;
	const remoteId = e.from.id;
	const sdp = e.sdp;

	console.log('offered');

	//Initialize the RTC connection

	//Create the remote description from the msg 
	let desc = new RTCSessionDescription(sdp);

	//Initialize the connection with handle
	window.rtcConnectionsByHandle[remoteHandle] = new RTCPeerConnection(stunServers);

	await establishConnection(remoteHandle, "passive");

	//Set the remote description which will fire the track event
	rtcConnectionsByHandle[remoteHandle].setRemoteDescription(desc)
		.then(() => navigator.mediaDevices.getUserMedia(constraints))
		.then((stream) => {
			fireVideoInputEvent(window.handle, stream);
			stream.getTracks().forEach((track) => rtcConnectionsByHandle[remoteHandle].addTrack(track, stream));
		})
		.then(() => window.rtcConnectionsByHandle[remoteHandle].createAnswer())
		.then((answer) => window.rtcConnectionsByHandle[remoteHandle].setLocalDescription(answer))
		.then(() => {

			//Create the msg for remote peer
			const msg = {
				type: 'answer',
				from: {
					handle: window.handle,
					id: window.socketId
				},
				to: {
					handle: remoteHandle,
					id: remoteId
				},
				sdp: rtcConnectionsByHandle[remoteHandle].localDescription

			}

			window.socket.emit('answer', msg);


		})
		.catch(err => console.log(err));


});


function fireHangUpEvent(partner) {

	const event = new CustomEvent('hang-up', {

		bubbles: true,
		composed: true,

		detail: {
			partner

		}

	});

	document.querySelector('app-chat').shadowRoot.querySelector('app-output').dispatchEvent(event);


}

function fireVideoInputEvent(partner, stream) {

	const event = new CustomEvent('video-input', {
		bubbles: true,
		composed: true,

		detail: {
			stream: stream,
			partner: partner
		}

	});

	const output = document.querySelector("app-chat").shadowRoot.querySelector("app-output");

	output.dispatchEvent(event);

}


async function establishConnection(toHandle, role) {

	//Find the id of the current partner
	const toId = window.usersInRoom.find((user) => user.handle === toHandle).id;

	//Initialize the connection with handle
	rtcConnectionsByHandle[toHandle] = new RTCPeerConnection(stunServers);

	if (role === "active")
		//Get local media stream and add it to the connection
		await getLocalMediaStream();

	//Set the negotiations handler
	rtcConnectionsByHandle[toHandle].onnegotiationneeded = (role === "active") ? handleNegotiation : null;

	//Set the handler for recieving remote stream
	rtcConnectionsByHandle[toHandle].ontrack = handleTrack;

	//Set the handler for receiving ICE candidates from browser to send to remote peer
	rtcConnectionsByHandle[toHandle].onicecandidate = handleIceCandidate;

	//Set the handler for receiving ICE candidate from remote peer
	rtcConnectionsByHandle[toHandle].onnewicecandidate = handleNewIceCandidate;


	//Get the local media stream
	async function getLocalMediaStream() {

		//Get the video stream
		await navigator.mediaDevices.getUserMedia(constraints)
			.then((stream) => {
				stream.getTracks().forEach((track) => rtcConnectionsByHandle[toHandle].addTrack(track, stream));
				fireVideoInputEvent(window.handle, stream);
			}).catch(err => console.log(err));

	}

	//Initiate negotiations with peer, fired when local tracks are added to connection
	function handleNegotiation(e) {

		//Create an offer
		rtcConnectionsByHandle[toHandle].createOffer()
			//Set the local description of the connection
			.then((offer) => rtcConnectionsByHandle[toHandle].setLocalDescription(offer))
			.then(() => {


				//Create the msg for remote peer
				const msg = {
					type: 'offer',
					from: {
						handle: window.handle,
						id: window.socketId
					},
					to: {
						handle: toHandle,
						id: toId
					},
					sdp: rtcConnectionsByHandle[toHandle].localDescription

				}

				//Send the offer to the remote peer
				window.socket.emit("offer", msg);
			})
			.catch((err) => console.log(err));


	}

	function handleTrack(e) {

		console.log("track");
		//		const remoteVideo = document.querySelector("app-chat").shadowRoot.querySelector("app-output").shadowRoot.querySelector(`video[data-handle="${toHandle}"]`);

		//		const remoteVideo = document.querySelector("app-chat").shadowRoot.querySelector("app-output").shadowRoot.querySelector(`video`);

		fireVideoInputEvent(toHandle, e.streams[0]);

		//		remoteVideo.srcObject = e.streams[0];

	}


	function handleIceCandidate(e) {

		//If a candidate exist then...
		if (e.candidate) {
			const msg = {
				type: 'new-ice-candidate',
				candidate: e.candidate,
				from: {
					handle: window.handle,
					id: window.socketId
				},
				to: {
					handle: toHandle,
					id: toId
				},
			}

			//Send the new ice candidate to peer
			window.socket.emit('new-ice-candidate', msg);

		}

	}

	function handleNewIceCandidate(e) {

		//Create a candidate object
		const candidate = new RTCIceCandidate(e.candidate);

		if (rtcConnectionsByHandle[handle]) {

			//Add candidate into connection
			rtcConnectionsByHandle[handle].addIceCandidate(candidate)
				.catch(err => console.log(err));


		}

	}

	return 1;

}


