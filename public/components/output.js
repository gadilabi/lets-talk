var templateOutput = document.createElement("template");

templateOutput.innerHTML = `

<style>
    #output {
        border: 1px solid black;
        width: 400px;
        height: 400px;

    }

</style>


<div id="output">

</div>



`;

class Output extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({

            mode: "open"
        });

        this.shadowRoot.appendChild(templateOutput.content.cloneNode(true));

        this.output = this.shadowRoot.querySelector('#output');

        //Create connection to ws on server
        this.socket = io.connect("http://localhost:3000/admin");




    }

    connectedCallback() {

        const that = this;

        this.addEventListener('send-msg', function (e) {
            that.addMessage(e.detail.handle, e.detail.msg);

            that.socket.emit("chat", {
                message: e.detail.msg,
                handle: e.detail.handle,


            });



        });

        this.socket.on('chat', function (data) {
            that.addMessage(data.message, data.handle);


        });

    }

    addMessage(handle, msg) {

        const msgElement = document.createElement("app-message");
        msgElement.setValues(handle, msg);

        this.output.appendChild(msgElement);


    }


}

//Define custom html element
window.customElements.define("app-output", Output);
