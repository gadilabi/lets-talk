var templateMessage = document.createElement("template");

templateMessage.innerHTML = `

<style>
    #message {
        width: 400px;
        height: auto;

    }

</style>


<div id="message">
    <span id="handle"></span>
    <p id="text"></p>
</div>



`;

class Message extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({

            mode: "open"
        });

        this.shadowRoot.appendChild(templateMessage.content.cloneNode(true));

        this.message = this.shadowRoot.querySelector('#message');
        this.handle = this.shadowRoot.querySelector('#handle');
        this.text = this.shadowRoot.querySelector('#text');

    }

    connectedCallback() {
        this.addEventListener('send-msg', function (e) {
            this.addMessage(e.detail.handle, e.detail.msg);

        });

    }

    setValues(handle, msg) {

        this.handle.textContent = handle;
        this.text.textContent = msg;


    }


}

//Define custom html element
window.customElements.define("app-message", Message);
