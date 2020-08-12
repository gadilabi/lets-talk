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

		//		this.addEventListener('create-room', (e) => {
		//			this.addUser("everyone");
		//
		//		});

		window.socket.on('someone-join-room', function (data) {
			window.usersInRoom.push(data);
			that.addUser(data.handle);
		});

		window.socket.on('users-list', function (data) {

			window.usersInRoom = data;
			window.handles = window.usersInRoom.map((entry) => entry.handle);
			that.addUser("everyone");

			window.handles.forEach((user) => {
				if (user !== window.handle)
					that.addUser(user);

			});


		});

	}

	addUser(handle) {

		const div = document.createElement("DIV");
		div.textContent = handle;
		div.dataset.handle = handle;
		div.addEventListener('click', (e) => {
			const event = new CustomEvent('choose-partner', {
				bubble: true,
				composed: true,
				detail: {
					partner: handle

				}


			});

			window.partner = handle;
			document.querySelector('app-chat').shadowRoot.querySelector('app-output').dispatchEvent(event);


		});

		this.usersList.appendChild(div);

		console.log("choose partner");

	}

}

//Define custom html element
window.customElements.define("app-users-list", UsersList);
