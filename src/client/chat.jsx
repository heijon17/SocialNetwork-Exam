// From https://github.com/arcuri82/web_development_and_api_design/blob/master/les09/chat/websocket-full/src/client/index.jsx

import React from "react";
import { withRouter } from "react-router-dom";

export class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Anonymous",
            text: "",
            messages: null
        }
    }

    componentDidMount() {
        this.socket = new WebSocket("ws://" + window.location.host);
        this.socket.onmessage = (e => {
            const msgList = JSON.parse(e.data);
            this.setState(
                prev => {
                    if (prev.messages === null) {
                        return { messages: msgList };
                    } else {
                        return { messages: [...prev.messages, ...msgList] };
                    }
                }
            );
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            this.setState({ name: nextProps.user.name });
        } 
    }

    onNameChange = (event) => {
        this.setState({ name: event.target.value });
    };

    onTextChange = (event) => {
        this.setState({ text: event.target.value });
    };

    sendMsg = () => {
        const payload = JSON.stringify({
            author: this.state.name,
            text: this.state.text
        });
        this.socket.send(payload);
        this.setState({ text: "" });
    };

    render() {

        let messages = <div></div>;

        if (this.state.messages !== null) {
            messages = <div>
                {this.state.messages.map(msg =>
                    <p key={msg.id}> {msg.author + ": " + msg.text}</p>
                )}
            </div>;
        }

        return (
            <div className="chatComponent">
                <h2>Chat window</h2>
                <div>
                    <p className="inputName">Your name:</p>
                    <input id="inputName" type="text"
                        className="inputName"
                        value={this.state.name}
                        onChange={this.onNameChange} />
                </div>
                <br />
                <div>
                    <p>Your message:</p>
                    <textarea id="inputMsg" cols="50"
                        rows="5"
                        value={this.state.text}
                        onChange={this.onTextChange} />
                </div>
                <br />

                <div id="sendId" className="btn" onClick={this.sendMsg}>Send</div>
                {messages}
            </div>
        )
    }
}
export default withRouter(Chat);