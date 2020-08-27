var templateOutput = document.createElement("template");

templateOutput.innerHTML = `

<style>

	#component{
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background-color: #082a49;
		padding-top: 0.1px;

	}

    #output {
		overflow: hidden;
        border: 1px solid black;
		margin-right: 80px;
		height: 90%;
		background-color: white;
    }

	#talking-to{
		height:10%;
		background-color: #082a49;
		color:white;
		margin: 0 80px auto 0;
		margin-right: auto;
	}

	#above-output{
		display:flex;
		justify-content: space-between;
		margin: 0px 80px 20px 0px;
	}

	#leave{
		all: unset;
		background-color: #00539c;	
		color: white;
		width: 150px;
		font-size: 25px;
		text-align: center;
		cursor: pointer;
		position: relative;
	}

	#leave::before{
		content: url('images/leave.svg');
		position: absolute;
		left: 0;
		width: 25px;
		height:25px;

	}

	#video-btn{
		all:unset;
		width: 75px;
		height: 29.6px;
		margin-right:20px;
		background-color: #00539c;
		text-align:center;
	}

	#video-btn>img{
		height: 100%;
		cursor: pointer;

	}

	#wrapper{
		display: flex;
		grid-template-columns: min-content auto;
		grid-template-rows: 100%;
		height:100%;
		max-height:100%;
		width:100%;

	}


	#videos{
		height:100%;
		position: relative;
	}

	#local-stream{
		position: absolute;
		height: 20%;
		bottom: 0;
		left: 0;
		z-index: 100;

	}

	.messages{
		overflow: auto;
		height: 100%;
		flex-grow: 1;
		

	}

	#controls{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		visibility: hidden;
		margin: auto;
		width: max-content;
	}


	.remote{
		height:100%;
		
	}

	#videos:hover > #controls {

		visibility: visible;

}

	@media(max-width: 800px){
		
		#wrapper{
			flex-direction: column;

		}

		#videos{
			width: 100%;
			height: auto;

		}
		
		#talking-to{
			display: none;

		}
	
		#output{
			margin: 0px 10px 20px 0px;


		}

		#above-output{
			margin: 0px 10px 20px 0px;


		}

		#videos{
			height: auto;
			width: 100%;

		}

		.remote{
			width: 100%;
			height:100%;
			object-fit: cover;
		}

	}
	

</style>

<div id="component">

	<div id="above-output">
		<h2 id="talking-to">Talking to everyone</h2>

		<button id="video-btn">
			<img src="images/video.svg" />
		</button>
		<button id="leave">
			Leave
		</button>

	</div>

	<div id="output">

		<div id="wrapper">
			<div data-partner="everyone" class="messages"></div>
		</div>

	</div>
	
</div>



`;

class Output extends HTMLElement {

	constructor() {
		super();

		const that = this;

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateOutput.content.cloneNode(true));

		this.leave = this.shadowRoot.querySelector('#leave');

		this.videoBtn = this.shadowRoot.querySelector("#video-btn");

		this.wrapper = this.shadowRoot.querySelector("#wrapper");
		this.messages = that.shadowRoot.querySelector('.messages');

		this.localVideo = document.createElement('video');
		this.localVideo.id = "local-stream";
		this.localVideo.muted = true;
		this.localVideo.autoplay = true;

		this.videos = null;
		this.output = this.shadowRoot.querySelector('#output');
		window.partner = "everyone";
		this.conversations = {
			everyone: {
				text: that.shadowRoot.querySelector('[data-partner="everyone"]'),
				video: null,
				active: 'text'
			}

		};

		this.talkingTo = this.shadowRoot.querySelector('#talking-to');

	}

	connectedCallback() {

		const that = this;

		this.addEventListener('add-partners', (e) => {

			this.addPartner(e.detail.handlesList);

		});


		this.addEventListener('hang-up', (e) => {

			const partner = e.detail.partner;
			that.conversations[partner].active = "text";

			if (window.partner === partner) {
				this.wrapper.querySelector('#videos').remove();
			}
		});




		this.addEventListener('video-input', (e) => {

			const partner = e.detail.partner;
			const stream = e.detail.stream;

			if (partner === window.handle) {

				//Load the stream into the local video element
				this.localVideo.srcObject = stream;

			} else {

				this.conversations[partner]['video'].srcObject = stream;
				this.conversations[partner].active = 'video';

				document.querySelector('app-chat').shadowRoot.querySelector('app-side-nav').shadowRoot.querySelector('app-users-list').shadowRoot.querySelector(`.user[data-handle="${partner}"]`).click();

				window.conversations = this.conversations;

			}


		});

		this.videoBtn.addEventListener('click', (e) => {

			if (window.partner === "everyone")
				return;

			const to = window.usersInRoom.find((user) => user.handle === window.partner).id;

			window.socket.emit("video-call-request", {

				fromHandle: window.handle,
				fromId: window.socketId,
				to: to

			});


		});

		this.leave.addEventListener('click', (e) => {

			window.socket.emit('disconnect');
			window.location.assign('/');

		});

		//When user push a user name
		this.addEventListener('choose-partner', function (e) {

			//Extract the new partner from event
			const partner = e.detail.partner;

			//Update the output header
			this.talkingTo.textContent = `Talking to ${partner}`;

			//Change the current chat partner
			window.partner = partner;

			//Remove the current conversation from output
			that.wrapper.remove();

			//Create a new wrapper
			const wrapper = document.createElement('DIV');
			wrapper.id = "wrapper";

			//Insert the conversation with current partner into the wrapper
			if (this.conversations[window.partner]['active'] === 'video') {

				//Create a wrapper for the videos
				const videoWrapper = document.createElement('DIV');
				videoWrapper.id = "videos";

				const controls = document.createElement('app-controls');
				controls.id = "controls";

				videoWrapper.appendChild(controls);
				videoWrapper.appendChild(this.conversations[window.partner]['video']);
				videoWrapper.appendChild(this.localVideo);

				wrapper.appendChild(videoWrapper);
				wrapper.appendChild(this.conversations[window.partner]['text']);

				this.localVideo.play()
					.catch(err => console.log(err));

				this.conversations[window.partner]['video'].play()
					.catch((err) => console.log(err));
			} else
				wrapper.appendChild(this.conversations[window.partner]['text']);

			//Insert the wrapped messages into the output
			that.output.appendChild(wrapper);

			that.wrapper = wrapper;
			that.messages = that.shadowRoot.querySelector('.messages');

		});

		this.addEventListener('send-msg', function (e) {
			that.addMessage(e.detail, "outgoing");

		});

		window.socket.on('chat', function (data) {

			if (!that.conversations.hasOwnProperty(data.handle)) {
				that.addPartner(data.handle);

			}

			if (window.partner === data.handle) {
				that.addMessage(data, "incoming");

			} else {

				that.addMessage(data, "incoming");

			}


		});



	}

	addVideos(handlesList) {

		handlesList.forEach((user) => {

			const video = document.createElement('video');
			video.dataset.handle = user;
			video.autoplay = true;

			//			if (user !== window.handle)
			//				this.conversations[user][video] = video;

			this.videos.appendChild(video);


		});

	}

	addPartner(partners) {

		partners.forEach((partner) => {

			//Create the wrapper for the messages
			const msgWrapper = document.createElement("DIV");
			msgWrapper.classList.add("messages");
			msgWrapper.dataset.partner = partner;

			//Create a video element
			const video = document.createElement('video');
			video.dataset.handle = partner;
			video.classList.add('remote');
			video.autoplay = true;

			//Add the text and video into the conversations list
			this.conversations[partner] = {
				text: msgWrapper,
				video: video
			};

		});


	}

	addMessage(data, direction) {

		let toHandle = null;

		if (window.usersInRoom.find((user) => user.id === data.to)) {

			toHandle = window.usersInRoom.find((user) => user.id === data.to).handle;

		} else {
			toHandle = "everyone";

		}

		const msgElement = document.createElement("app-message");
		msgElement.setValues(data.handle, data.msg);


		if (direction === "incoming" && toHandle === window.handle)
			this.conversations[data.handle]['text'].appendChild(msgElement);
		else if (direction === "incoming" && toHandle === "everyone")
			this.conversations["everyone"]['text'].appendChild(msgElement);
		else if (direction === "outgoing" && toHandle === "everyone")
			this.conversations["everyone"]['text'].appendChild(msgElement);
		else
			this.conversations[toHandle]['text'].appendChild(msgElement);



		this.messages.scrollTop = this.messages.scrollHeight;

	}


}

//Define custom html element
window.customElements.define("app-output", Output);
