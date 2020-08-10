var templateMenu = document.createElement("template");

templateMenu.innerHTML = `

<style>
    #message {
        width: 400px;
        height: auto;

    }

</style>


<div id="menu">

	<app-main-menu></app-main-menu>
	<app-join-menu></app-join-menu>
	<app-create-menu></app-create-menu>

</div>



`;

class Menu extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateMenu.content.cloneNode(true));

		//		this.style.display = "none";

		this.status = "open";

		this.main = this.shadowRoot.querySelector('app-screen-main');
		this.join = this.shadowRoot.querySelector('app-screen-join');

	}

	connectedCallback() {

		const that = this;

		this.addEventListener("create-room", function (e) {

			that.close();

		});

		this.addEventListener("join-room", function (e) {

			that.close();

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
window.customElements.define("app-menu", Menu);
