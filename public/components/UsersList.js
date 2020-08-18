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
		font-size: 25px;

	}

	#users{
		display: flex;
		flex-direction: column;
		color:white;
		margin: 20px 20px 0px 20px;
	}

	#room-name{
		color:white;
		margin: 0px 20px 0px 20px;

	}

	.user{
		border-radius: 5px;
		background-color: #00539c;
		cursor: pointer;
		margin-bottom: 10px;

	}

	.selected{
		box-shadow: 0 0 8px white;
		
	}

	h3::before{
		content: url('images/user.svg');
		position: absolute;
		height: 25px;
		width: 25px;
		left: 20px;

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

		//Add the user everyone- which refers to public messages to the list of users in room
		this.addUser("everyone");

		//The element represnting the current chat partner, initialize to everyone
		this.selected = this.shadowRoot.querySelector('[data-handle="everyone"]');

		this.selected.classList.toggle("selected");
	}

	connectedCallback() {

		const that = this;

		window.socket.on('disconnected', function (id) {
			that.removeUser(id);

		});

		window.socket.on('someone-join-room', function (data) {
			window.usersInRoom.push(data);
			that.addUser(data.handle);
			if (window.handle !== data.handle)
				that.fireAddVideosEvent([data.handle]);
		});

		//When connected to a room the server sends a list of all the users in that room
		window.socket.on('users-list', function (data) {

			//Save the list of users in the global variable usersInRoom
			window.usersInRoom = data;

			//Create a global variable with the handles of all users in the room
			window.handles = window.usersInRoom.map((entry) => entry.handle);

			//Create a global variable with the socket id of local user
			window.socketId = window.usersInRoom.find((user) => user.handle === window.handle).id;

			//Add the handles of all the users in the room to the list but your own name
			window.handles.forEach((user) => {
				if (user !== window.handle)
					that.addUser(user);

			});

			that.fireAddVideosEvent(window.handles);

		});

	}

	//Event fired when user list is received from the server
	fireAddVideosEvent(handlesList) {

		const event = new CustomEvent("add-videos", {
			bubbles: true,
			composed: true,

			detail: {
				handlesList: handlesList

			}
		});

		document.querySelector("app-chat").shadowRoot.querySelector("app-output").dispatchEvent(event);
	}

	addUser(handle) {

		//Create the user div
		const div = document.createElement("DIV");

		//Place the user handle into the div
		div.textContent = handle;

		//Add a data-handle attribute to div
		div.dataset.handle = handle;

		//Add the class user to the div
		div.classList.add("user");

		//Add the click event to every user in the list
		div.addEventListener('click', (e) => {

			//Update the global variable partner which holds the current chat partner
			window.partner = handle;

			//Toggle off the selected from the former selected
			this.selected.classList.toggle("selected");

			//Set the user as the currently selected one
			this.selected = e.target;

			//Toggle on the selected class on the currently selected user
			this.selected.classList.toggle("selected");

			//This event tells the system we chose a new chat partner
			const event = new CustomEvent('choose-partner', {
				bubble: true,
				composed: true,
				detail: {
					partner: handle

				}


			});


			//Dispatch the event to app-output where the proper updating will take place
			document.querySelector('app-chat').shadowRoot.querySelector('app-output').dispatchEvent(event);


		});

		//Add the user to the users list
		this.usersList.appendChild(div);

	}

	removeUser(id) {

		const handle = window.usersInRoom.find((user) => user.id === id).handle;

		//Remove user from the list of users in room
		window.usersInRoom = window.usersInRoom.filter((user) => user.id !== id);

		//Remove user from users list on screen
		this.usersList.querySelector(`[data-handle="${handle}"]`).remove();

	}

}

//Define custom html element
window.customElements.define("app-users-list", UsersList);
