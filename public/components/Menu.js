var templateMenu = document.createElement("template");

templateMenu.innerHTML = `

<style>


#component{
	width:100vw;
	min-height:100vh;
	background-color: #082a49;

}


#logo{
	display:flex;
	justify-content:center;
	margin: 50px 0 100px 0;

}

#logo>img{
	height: 150px;

}

@media(max-width: 800px){

	#component{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#logo>img{

		width: 40vw;
		height: auto;

	}

	#logo{
		margin: 5vw 0 5vw 0;
	}
}

@media(max-width: 450px){

	#component{
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	#logo>img{

		width: 90vw;
		height: auto;

	}

	#logo{

		margin: 5vw 0 8vw 0;

	}

}



</style>


<div id="component">
	<div style="height:1px;"></div>

	<div id="logo">
		<img src="images/logo.png" alt="" />

	</div>

	<div id="menu">

		<app-main-menu></app-main-menu>
		<app-join-menu></app-join-menu>
		<app-create-menu></app-create-menu>

	</div>

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

		this.addEventListener("enter-room", function (e) {

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
