var templateChat = document.createElement("template");

templateChat.innerHTML = `

<style>
	
	#wrapper{
		width:100vw;
		min-height:100vh;
		display: grid;
		grid-template-columns: 20vw 80vw;
		grid-template-areas:
			"top-nav top-nav"
			"side-nav output"
			"side-nav input";

		grid-template-rows: 20vh 70vh 1fr;
	}

	app-top-nav{
		grid-area: top-nav;

	}

	app-side-nav{
		grid-area: side-nav;

	}

	app-output{
		grid-area: output;

	}

	#private{
		display: none;
		grid-area: private;
		
	}

	app-input{
		grid-area: input;
		box-sizing: border-box;

	}

	#request-call-prompt{
		display: none;
		position: absolute;
		top: 0;
		bottom: 0;
		right:0;
		left:0;
		margin: auto auto;
		z-index: 100;
		width: max-content;
		height:100px;
		background-color: #1c5c68;
		text-align:center;
		color:white;
		padding: 20px;

	}

	#prompt-text{
		
		margin-top: 20px;

	}

	#prompt-buttons{
		display:flex;
		justify-content: center;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	#prompt-buttons>button{
		padding: 5px;
		cursor: pointer;
	}

	#accept-call{
		all: unset;
		background-color: #03bc3e;
		margin-right:20px;
		color:white;
		width: 25%;

	}

	#decline-call{
		all: unset;
		background-color: crimson;
		color:white;
		width: 25%;
	

	}

	@media(max-width: 800px){

		#wrapper{
			grid-template-rows: 10vh 80vh 1fr;
			grid-template-columns: 40vw 60vw;

		}


	}

</style>
<div id="wrapper">

	<app-top-nav></app-top-nav>
	<app-side-nav></app-side-nav>
	<app-output></app-output>
	<app-input></app-input>

	<div data-to="" id="request-call-prompt">

		<div id="prompt-text"></div>

		<div id="prompt-buttons">
			<button id="accept-call">
				accpet
			</button>

			<button id="decline-call">
				decline
			</button>
		

		</div>


	</div>

</div>

`;

class Chat extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateChat.content.cloneNode(true));

		//Set starting display value as none
		this.style.display = "none";
		this.status = "close";

		//Get relevant elements
		this.output = this.shadowRoot.querySelector('app-output');
		this.input = this.shadowRoot.querySelector('app-input');
		this.requestCallPormpt = this.shadowRoot.querySelector("#request-call-prompt");
		this.promptText = this.shadowRoot.querySelector("#prompt-text");
		this.acceptCallBtn = this.shadowRoot.querySelector("#accept-call");
		this.declineCallBtn = this.shadowRoot.querySelector("#decline-call");

	}

	connectedCallback() {

		const that = this;

		that.addEventListener("enter-room", function (e) {

			that.open();

		});

		this.acceptCallBtn.addEventListener("click", e => {

			const toId = this.requestCallPormpt.dataset.to;

			this.requestCallPormpt.style.display = "none";

			const msg = {
				pickedUp: true,
				to: toId

			};

			window.socket.emit('video-call-answer', msg);


		});

		this.declineCallBtn.addEventListener("click", e => {

			this.requestCallPormpt.style.display = "none";
			
			const toId = this.requestCallPormpt.dataset.to;
			
			const msg = {
				pickedUp: false,
				to: toId

			};

			window.socket.emit('video-call-answer', msg);


		});

		this.addEventListener('video-call-request', e => {

			const fromHandle = e.detail.fromHandle;

			this.requestCallPormpt.style.display = "block";
			this.promptText.textContent = `Would you like to accept a video call from ${fromHandle}?`;
			this.requestCallPormpt.dataset.to = e.detail.fromId;


		});


	}

	acceptCall(e) {

		const toId = this.requestCallPormpt.dataset.to;

		this.requestCallPormpt.style.display = "none";

		const msg = {
			pickedUp: true,
			to: toId

		};

		window.socket.emit('video-call-answer', msg);


	}

	declineCall(e) {

		const toId = this.requestCallPormpt.dataset.to;

		const msg = {
			pickedUp: false,
			to: toId

		};

		window.socket.emit('video-call-answer', msg);


	}

	askToTakeCall(e) {

		const fromHandle = e.detail.fromHandle;

		this.requestCallPormpt.style.display = "block";
		this.promptText.textContent = `Would you like to accept a video call from ${fromHandle}`;
		this.requestCallPormpt.dataset.to = e.detail.fromId;

	}

	open() {
		this.status = "open";
		this.style.display = "flex";
	}

	close() {

		this.status = "close";
		this.style.display = "none";

	}



}

//Define custom html element
window.customElements.define("app-chat", Chat);
