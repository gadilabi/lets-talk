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


		<div data-partner="everyone" class="messages"></div>
		<div id="videos">
			<video autoplay></video>
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

		this.videos = this.shadowRoot.querySelector("#videos");
		this.output = this.shadowRoot.querySelector('#output');
		window.partner = "everyone";
		this.conversations = {
			everyone: that.shadowRoot.querySelector('[data-partner="everyone"]')

		};

		this.talkingTo = this.shadowRoot.querySelector('#talking-to');

	}

	connectedCallback() {

		const that = this;

		//Add video elements
		//		this.addVideos();

		this.videoBtn.addEventListener('click', (e) => {

			//Initiate the RTC connection with handle
			establishConnection(window.partner, "active");


		});

		this.leave.addEventListener('click', (e) => {

			window.socket.emit('disconnect');
			window.location.assign('/');

		});

		//When user push a user name
		this.addEventListener('choose-partner', function (e) {

			const partner = e.detail.partner;

			this.talkingTo.textContent = `Talking to ${partner}`;

			//Change the current chat partner
			window.partner = partner;

			//Remove the current conversation from output
			that.shadowRoot.querySelector('.messages').remove();

			if (!that.conversations.hasOwnProperty(window.partner)) {

				const div = that.addPartner(partner);

				//Insert the wrapped messages into the output
				this.output.appendChild(div);

			} else {

				//Insert the wrapped messages into the output
				that.output.appendChild(that.conversations[window.partner]);

			}


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

	addVideos() {

		window.usersInRoom.forEach((user) => {

			const video = document.createElement('video');
			video.dataset.handle = window.partner;

			this.videos.appendChild(video);


		});



	}

	addPartner(partner) {

		//Create the wrapper for the messages
		const div = document.createElement("DIV");
		div.classList.add("messages");
		div.dataset.partner = partner;

		this.conversations[partner] = div;

		return div;

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
			this.conversations[data.handle].appendChild(msgElement);
		else if (direction === "incoming" && toHandle === "everyone")
			this.conversations["everyone"].appendChild(msgElement);
		else if (direction === "outgoing" && toHandle === "everyone")
			this.conversations["everyone"].appendChild(msgElement);
		else
			this.conversations[toHandle].appendChild(msgElement);


		this.output.scrollTop = this.output.scrollHeight;

	}


}

//Define custom html element
window.customElements.define("app-output", Output);
