var templateOutput = document.createElement("template");

templateOutput.innerHTML = `

<style>

	#component{
		width: 100%;
		height: 100%;
		background-color: #082a49;
		padding-top: 0.1px;

	}

    #output {
		overflow: auto;
        border: 1px solid black;
		margin-right: 80px;
		margin-bottom: 30px;
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
			<div id="videos">
				<video autoplay></video>
			</div>
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

		this.videos = this.shadowRoot.querySelector("#videos");
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


		this.addEventListener('video-input', (e) => {

			const partner = e.detail.partner;
			const stream = e.detail.stream;

			this.conversations[partner]['video'].srcObject = stream;
			this.conversations[partner].active = 'video';

			window.conversations = this.conversations;

		});

		this.videoBtn.addEventListener('click', (e) => {

			//Initiate the RTC connection with current partner as the caller (thus active)
			establishConnection(window.partner, "active");

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

				wrapper.appendChild(this.conversations[window.partner]['video']);
				this.conversations[window.partner]['video'].play();
			} else
				wrapper.appendChild(this.conversations[window.partner]['text']);

			//Insert the wrapped messages into the output
			that.output.appendChild(wrapper);

			that.wrapper = wrapper;

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
			video.setAttribute("autoplay", "");

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
			video.setAttribute("autoplay", "");

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


		this.output.scrollTop = this.output.scrollHeight;

	}


}

//Define custom html element
window.customElements.define("app-output", Output);
