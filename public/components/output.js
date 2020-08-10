var templateOutput = document.createElement("template");

templateOutput.innerHTML = `

<style>

	#component{
		width: 100%;
		height: 100%;
		background-color: #082a49;

	}

    #output {
		overflow: auto;
        border: 1px solid black;
		margin-right: 80px;
		height: 100%;
		background-color: white;
    }

</style>

<div id="component">

<div id="output"></div>

</div>



`;

class Output extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateOutput.content.cloneNode(true));

		this.output = this.shadowRoot.querySelector('#output');


	}

	connectedCallback() {

		const that = this;

		this.addEventListener('send-msg', function (e) {
			that.addMessage(e.detail);

			window.socket.emit("chat", {
				msg: e.detail.msg,
				handle: e.detail.handle,

			});



		});

		this.addEventListener('create', function (e) {

			that.addMessage("", `The ID for this room is: ${e.detail.roomId}`);

			window.socket.on('chat', function (data) {
				that.addMessage(data.handle, data.message);

			});

		});


	}

	addMessage(data) {

		const msgElement = document.createElement("app-message");
		msgElement.setValues(data.handle, data.msg);

		this.output.appendChild(msgElement);

		this.output.scrollTop = this.output.scrollHeight;

	}


}

//Define custom html element
window.customElements.define("app-output", Output);
