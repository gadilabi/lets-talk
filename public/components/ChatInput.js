var templateChatInput = document.createElement("template");

templateChatInput.innerHTML = `

<style>

	#component{
		display: flex;
		align-items:center;
		height: 100%;
		background-color: #082a49;


	}

	#wrapper{
		flex-grow:1;
		display: flex;
		margin-right: 80px;
		font-size: 30px;

	}

	input{
		flex-grow: 1;
	}

	button{
		all: unset;
		display: flex;
		text-align: center;
		background-color: #00539CFF;
		color:white;
		width:100px;
		justify-content: center;
	}

	button>img{
		align-self: center;
		height: 30px;
}

	@media(max-width: 800px){

		button{
			font-size: 20px;
			width: auto;
			padding: 0 5px 0 5px;
		}


		#component{

			align-items: start;

		}

		#wrapper{
			margin-right: 10px;
		}

	}

</style>

<div id="component">

	<div id="wrapper">

		<input id="msg" placeholder="message" />
		<button id="send">
		
		<img src="/images/send.svg">

		</button>

	</div>

</div>


`;

class ChatInput extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateChatInput.content.cloneNode(true));

		//Get relevant elements inside the component
		this.input = this.shadowRoot.querySelector('#msg');
		this.send = this.shadowRoot.querySelector('#send');

	}

	connectedCallback() {

		const that = this;

		//Send message when user press enter
		this.input.addEventListener('keydown', function (e) {
			if (e.key === "Enter")
				that.fireSendMsg(e);


		});

		//Send message when user clicks the send button
		this.send.addEventListener('click', function (e) {

			that.fireSendMsg(e);

		});

	}


	//Run when msg sent
	fireSendMsg() {

		//Find the id of the user to whom the msg is meant
		const to = (window.usersInRoom.find(user => user.handle === window.partner)) ?
			window.usersInRoom.find(user => user.handle === window.partner).id :
			"everyone";

		//Send the msg to server
		window.socket.emit("chat", {
			msg: this.input.value,
			handle: window.handle,
			to: to
		});

		//Fire a send-msg event to app-output component 
		const event = new CustomEvent('send-msg', {

			//The values for bubble and composed allow event to bubble outside of shadow dom
			bubbles: true,
			composed: true,
			//The current number page to be sent to server
			detail: {

				msg: this.input.value,
				handle: window.handle,
				to

			}


		});


		this.input.value = "";
		this.input.focus();

		document.querySelector('app-chat').shadowRoot.querySelector("app-output").dispatchEvent(event);



	}


}

//Define custom html element
window.customElements.define("app-input", ChatInput);
