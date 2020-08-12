var templateChat = document.createElement("template");

templateChat.innerHTML = `

<style>
	
	#wrapper{
		width:100vw;
		height:100vh;
		display: grid;
		grid-template-columns: 20vw 80vw;
		grid-template-areas:
			"top-nav top-nav"
			"side-nav output"
			"side-nav input";

		grid-template-rows: 20vh 70vh 10vh;

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

	}


</style>
<div id="wrapper">

	<app-top-nav></app-top-nav>
	<app-side-nav></app-side-nav>
	<app-output></app-output>
	<app-input></app-input>

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

		this.output = this.shadowRoot.querySelector('app-output');
		this.input = this.shadowRoot.querySelector('app-input');

	}

	connectedCallback() {

		const that = this;

		that.addEventListener("create-room", function (e) {

			that.open();

		});

		that.addEventListener("join-room", function (e) {

			that.open();

		});


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
