const templateSideNav = document.createElement("template");

templateSideNav.innerHTML = `

<style>
	
	#component{
		box-sizing: border-box;
		width:100%;
		height:100%;
		background-color: #082a49;
		padding-top: 1px;
		padding-bottom: 1px;

	}

	app-users-list{
		display: flex;
		flex-direction: column;
		color:white;
		margin: 20px 20px 0px 20px;
	}

	#room-name{
		color:white;
		margin: 20px 20px 0px 20px;


	}

	

</style>

<div id="component">

	<h2 id="room-name">
	Room: Web Components

	</h2>

	<app-users-list></app-users-list>
		

</div>

`;

class SideNav extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateSideNav.content.cloneNode(true));

		this.roomName = this.shadowRoot.querySelector('#room-name');


	}

	connectedCallback() {

		const that = this;

		this.addEventListener('create-room', function (e) {
			that.roomName.textContent = `Room: ${e.detail.roomName}`;

		});

		this.addEventListener('join-room', function (e) {
			that.roomName.textContent = `Room: ${e.detail.roomName}`;


		});



	}




}

//Define custom html element
window.customElements.define("app-side-nav", SideNav);
