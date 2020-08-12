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
		margin: 0 80px 10px 0;
	}


</style>

<div id="component">
	<h2 id="talking-to">Talking to everyone</h2>

	<div id="output">

		<div data-partner="everyone" class="messages"></div>

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

		this.output = this.shadowRoot.querySelector('#output');
		window.partner = "everyone";
		this.conversations = {
			everyone: that.shadowRoot.querySelector('[data-partner="everyone"]')

		};

		this.talkingTo = this.shadowRoot.querySelector('#talking-to');

	}

	connectedCallback() {

		const that = this;


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

		console.log(this.conversations);
		console.log(data, direction, toHandle);


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
