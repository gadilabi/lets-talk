var templateMessage = document.createElement("template");

templateMessage.innerHTML = `

<style>
    #message {
		margin: 20px;
        max-width: 85%;
        height: auto;
		color: black;
		background-color: #639199;
		color:white;
		border-radius: 5px;
    	width: 50ch;
		padding-bottom: 5px;
	}

	#handle{
		font-weight: bold;
		margin-left: 5px;
	}

	#text{
		margin-left: 5px;

	}

	#details{
		margin-bottom: 5px;

	}




</style>

<div id="component">

	<div id="message">
		<div id="details">
			<span id="handle"></span>
			<span id="time"></span>
		</div>

		<div id="text"></div>
	</div>

</div>


`;

class Message extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateMessage.content.cloneNode(true));

		this.message = this.shadowRoot.querySelector('#message');
		this.handle = this.shadowRoot.querySelector('#handle');
		this.text = this.shadowRoot.querySelector('#text');
		this.time = this.shadowRoot.querySelector('#time');

	}

	connectedCallback() {
		this.addEventListener('send-msg', function (e) {
			this.addMessage(e.detail.handle, e.detail.msg);

		});

	}

	setValues(handle, msg) {

		this.handle.textContent = `${handle}`;
		this.text.textContent = msg;

		const date = new Date();
		const hour = date.getHours();
		const minutes = date.getMinutes();

		const hourString = (hour < 10) ? `0${hour}` : `${hour}`;
		const minutesString = (minutes < 10) ? `0${minutes}` : `${minutes}`;

		this.time.textContent = `${hourString}:${minutesString}`;


	}


}

//Define custom html element
window.customElements.define("app-message", Message);
