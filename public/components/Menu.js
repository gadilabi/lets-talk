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
}

#logo>img{
	height: 200px;
	margin: 50px 0 100px 0;

}

@media(max-width: 600px){

	#logo>img{

		width: 400px;
		height: auto;
	margin: 50px 0 100px 0;

	}


}



</style>


<div id="component">
	<div id="logo">
		<img src="images/logo.svg" alt="" />

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
