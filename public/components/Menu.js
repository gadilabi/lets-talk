var templateMenu = document.createElement("template");

templateMenu.innerHTML = `

<style>
    #message {
        width: 400px;
        height: auto;

    }

</style>


<div id="menu">

	<app-screen-main></app-screen-main>
	<app-screen-create></app-screen-create>
	<app-screen-join></app-screen-join>

</div>



`;

class Menu extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateMenu.content.cloneNode(true));

		this.main = this.shadowRoot.querySelector('app-screen-main');
		this.create = this.shadowRoot.querySelector('app-screen-create');
		this.join = this.shadowRoot.querySelector('app-screen-join');

	}

	connectedCallback() {
		this.addEventListener('next-screen', function (e) {

			this.main.style.display = "none";

			switch (e.detail.option) {
				case "create":
					this.create.style.display = "block";
					break;
				case "join":
					this.join.style.display = "block";
					break;

			}

		});

		this.addEventListener('back', function (e) {

			this.main.style.display = "block";
			this.create.style.display = "none";
			this.join.style.display = "none";


		});


	}



}

//Define custom html element
window.customElements.define("app-menu", Menu);
