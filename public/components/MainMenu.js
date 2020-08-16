var templateMainMenu = document.createElement("template");

templateMainMenu.innerHTML = `

<style>

	#wrapper{

		display: grid;
		justify-content: center;
		

	}
    
	#screen {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	
    }


	button{

		all:unset;
		box-sizing: border-box;
		width: 250px;
		margin-bottom: 20px;
		font-size: 35px;
		background-color: #00539CFF;
		color: white;
		text-align: center;
		cursor: pointer;
		border-radius: 3px;

	}

	
</style>

<div id="wrapper">

	<div id="screen">

		<button id="create">Create Room</button>
		<button id="join">Join Room</button>

	</div>

</div>



`;

class MainMenu extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateMainMenu.content.cloneNode(true));

		this.status = "open";

		this.create = this.shadowRoot.querySelector('#create');
		this.join = this.shadowRoot.querySelector('#join');

	}

	connectedCallback() {

		const that = this;

		this.addEventListener('back', function (e) {

			that.open();

		});


		//If user choose create
		this.create.addEventListener('click', async function (e) {

			that.close();

			const event = new CustomEvent('next-menu', {

				detail: {
					option: 'create'
				}

			});

			document.querySelector("app-menu").shadowRoot.querySelector("app-create-menu").dispatchEvent(event);

		});


		//If user choose join
		this.join.addEventListener('click', function (e) {

			that.close();

			const event = new CustomEvent('next-menu', {

				detail: {
					option: 'join'

				}

			});

			document.querySelector("app-menu").shadowRoot.querySelector("app-join-menu").dispatchEvent(event);

		});




	}

	close() {
		this.status = "close";
		this.style.display = "none";

	}

	open() {
		this.status = "open";
		this.style.display = "block";
	}


}

//Define custom html element
window.customElements.define("app-main-menu", MainMenu);
