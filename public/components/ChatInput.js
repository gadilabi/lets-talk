var templateChatInput = document.createElement("template");

templateChatInput.innerHTML = `


    <input id="msg" placeholder="message" />

    <button id="send">Send</button>

`;

class ChatInput extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({

            mode: 'open'
        });

        this.shadowRoot.appendChild(templateChatInput.content.cloneNode(true));

        this.input = this.shadowRoot.querySelector('#msg');
        this.send = this.shadowRoot.querySelector('#send');

    }

    connectedCallback() {
        
        const that = this;
        
        this.send.addEventListener('click', function (e) {
            
            
            const event = new CustomEvent('send-msg', {

                //The values for bubble and composed allow event to bubble outside of shadow dom
                bubbles: true,
                composed: true,
                //The current number page to be sent to server
                detail: {
                    
                    msg: that.input.value,
                    handle: Math.random()

                }


            });
            
            document.querySelector('app-output').dispatchEvent(event);


        });

    }


}

//Define custom html element
window.customElements.define("app-input", ChatInput);
