var templateScreenMain = document.createElement("template");

templateScreenMain.innerHTML = `

<style>
    #message {
        width: 400px;
        height: auto;

    }

</style>


<div id="screen">

	<input placeholder="room name" />
    <button>Create Room</button>

</div>



`;

class ScreenMain extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateScreenMain.content.cloneNode(true));

		this.create = this.shadowRoot.querySelector('#create');
		this.join = this.shadowRoot.querySelector('#join');

	}

	connectedCallback() {

		//If user choose create
		this.create.addEventListener('click', function (e) {

			const event = new CustomEvent('next-screen', {

				detail: {
					option: 'create'

				}

			});

			document.querySelector("app-menu").dispatchEvent(event);


		});


		//If user choose join
		this.join.addEventListener('click', function (e) {

			const event = new CustomEvent('next-screen', {

				detail: {
					option: 'join'

				}

			});

			document.querySelector("app-menu").dispatchEvent(event);

		});




	}



}

//Define custom html element
window.customElements.define("app-screen-main", ScreenMain);
