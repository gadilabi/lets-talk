var templateCreateMenu = document.createElement("template");

templateCreateMenu.innerHTML = `

<style>
	#wrapper{

		display: grid;
		place-items: center;
        width: 100vw;
        height: 100vh;
		

	}
    
	#menu {

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 400px;
		height: 400px;
		background-color: #ADEFD1FF;
		position: relative;

    }

	#menu>*{
		margin-bottom: 20px;

	}

	#banner{

		position: absolute;
		top: 0;
		width: 100%;

	}

	h1{
		text-align: center;
		margin:0;
		background-color: #00539CFF;
		color:white;
		font-size:45px;

	}
	
	button{

		all:unset;
		box-sizing: border-box;
		width: 150px;
		margin-bottom: 20px;
		font-size: 25px;
		background-color: #00539CFF;
		color: white;
		text-align: center;
		cursor: pointer;
		border-radius: 3px;

	}

	input{
		all:unset;
		border: 1px solid black;
		width: 150px;
		margin-bottom: 20px;
		
	}

	input:focus{

	}

	#name-room{
		
		display:flex;
		margin-bottom: 20px;
	}
	
	#warning{
		display:none;
		color: black;
	}

</style>


<div id="wrapper">

	<div id="menu">

		<div id="banner">
			<h1>Create Room</h1>
		</div>


		<span id="warning"></span>
		<input id="handle" placeholder="Handle" />
		<input id="room-name" placeholder="Enter room name" />
		<button id="create">Create</button>
		<button id="back">Back</button>

	</div>

</div>




`;

class CreateMenu extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: "open"
		});

		this.shadowRoot.appendChild(templateCreateMenu.content.cloneNode(true));

		this.style.display = "none";

		this.warning = this.shadowRoot.querySelector('#warning');
		this.inputHandle = this.shadowRoot.querySelector('#handle');
		this.inputRoomName = this.shadowRoot.querySelector('#room-name');
		this.create = this.shadowRoot.querySelector('#create');
		this.back = this.shadowRoot.querySelector('#back');

	}

	connectedCallback() {

		const that = this;

		this.addEventListener('next-menu', function (e) {

			console.log("opened create");
			that.open();

		});



		//If user choose join
		this.create.addEventListener('click', function (e) {

			//If no name was given do nothing
			if (that.inputRoomName.value === "" || that.inputHandle.value === "")
				return;

			if (that.doesRoomExists(that.inputRoomName.value)) {

				that.showWarning('Room name in use');
				return;
			}

			window.room = that.inputRoomName.value;
			window.handle = that.inputHandle.value;

			window.socket.emit('create-room', {
				handle: that.inputHandle.value,
				roomName: that.inputRoomName.value
			});

			const event = new CustomEvent('create-room', {

				detail: {
					roomName: that.inputRoomName.value,
					handle: that.inputHandle.value
				}

			});

			document.querySelector("app-menu").dispatchEvent(event);
			document.querySelector("app-chat").dispatchEvent(event);
			document.querySelector("app-chat").shadowRoot.querySelector('app-side-nav').shadowRoot.querySelector('app-users-list').dispatchEvent(event);
			document.querySelector("app-chat").shadowRoot.querySelector('app-side-nav').dispatchEvent(event);


		});

		//Go back to main menu
		this.back.addEventListener('click', function (e) {

			that.close();

			const event = new CustomEvent('back', {

				detail: {

				}

			});

			document.querySelector("app-menu").shadowRoot.querySelector("app-main-menu").dispatchEvent(event);

		});


	}

	showWarning(warning) {
		this.warning.style.display = "inline";
		this.warning.textContent = warning;
		setTimeout(() => {
			this.warning.style.display = "none";
		}, 1500);



	}

	doesRoomExists(room) {
		return window.rooms.includes(room);

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
window.customElements.define("app-create-menu", CreateMenu);
