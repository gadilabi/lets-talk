const templateUsersList = document.createElement("template");

templateUsersList.innerHTML = `

<style>
	
	#component{
		box-sizing: border-box;
		width:100%;
		height:100%;
		background-color: #082a49;
		padding-top: 1px;
		padding-bottom: 1px;

	}

	#users{
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

	<div id="users">
		<h3>
		Users
		</h3>


	</div>	

</div>

`;

class UsersList extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateUsersList.content.cloneNode(true));

		this.usersList = this.shadowRoot.querySelector("#users");


	}

	connectedCallback() {

		const that = this;

		this.addEventListener('create-room', (e) => {
			const div = document.createElement("DIV");
			div.textContent = e.detail.handle;
			that.usersList.appendChild(div);


		});

		window.socket.on('someone-join-room', function (data) {
			const div = document.createElement("DIV");
			div.textContent = data.handle;
			that.usersList.appendChild(div);



		});

		window.socket.on('users-list', function (data) {

			data.forEach((user) => {
				const div = document.createElement("DIV");
				div.textContent = user;
				that.usersList.appendChild(div);

			});


		});

	}

}

//Define custom html element
window.customElements.define("app-users-list", UsersList);
