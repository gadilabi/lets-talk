var templateControls = document.createElement("template");

templateControls.innerHTML = `

<style>
	
	#component{
		width:100%;
		height:100%;
		
	}

	#wrapper{
		dispaly: flex;
		justify-content: space-between;
	}

	button{
		all: unset;
		margin-left: 20px;
	}

	img{
		width: 75px;
		height: 75px;

	}

</style>

<div id="component">

	<div id="wrapper">

		<button id="hang-up">
			<img src="images/hang_up.svg" />
		</button>

	</div>

</div>

`;

class Controls extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateControls.content.cloneNode(true));

		this.hangUp = this.shadowRoot.querySelector('#hang-up');
		window.videoControls = this;
	}

	connectedCallback() {

		const that = this;
		console.log("hello");

		this.hangUp.addEventListener('click', (e) => {

			console.log('hang up');

			//Fire the hang up event to update relevant components
			that.fireHangUpEvent(window.partner);

			//Close the rtc connection with the current partner
			window.rtcConnectionsByHandle[window.partner].close();
			window.rtcConnectionsByHandle[window.partner] = null;

			const toId = window.usersInRoom.find((user) => user.handle === window.partner).id;

			//Send the hang up event to partner
			const payload = {
				fromHandle: window.handle,
				toId: toId
			};

			socket.emit('hang-up', payload);

		});



	}


	fireHangUpEvent(partner) {

		const event = new CustomEvent('hang-up', {

			bubbles: true,
			composed: true,

			detail: {
				partner

			}

		});

		document.querySelector('app-chat').shadowRoot.querySelector('app-output').dispatchEvent(event);


	}


}

//Define custom html element
window.customElements.define("app-controls", Controls);
