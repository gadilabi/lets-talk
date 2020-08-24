var templateTopNav = document.createElement("template");

templateTopNav.innerHTML = `

<style>
	
	#component{
		width:100%;
		height:100%;
		background-color: #082a49;
		
	}

	#logo{
		height: 80%;

	}

	#logo>img{
		height:100%;
	}

</style>

<div id="component">

	<div id="logo">
		<img src="images/logo.svg" alt="">

	</div>


	

</div>

`;

class TopNav extends HTMLElement {

	constructor() {
		super();

		this.attachShadow({

			mode: 'open'
		});

		this.shadowRoot.appendChild(templateTopNav.content.cloneNode(true));



	}

	connectedCallback() {

		const that = this;



	}




}

//Define custom html element
window.customElements.define("app-top-nav", TopNav);
