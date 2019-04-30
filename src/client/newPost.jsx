const React = require('react');
import { withRouter } from 'react-router-dom';

export class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: null,
            title: "",
            text: ""
        }
    
    }

    onTitleChange = (event) => {
        this.setState({ title: event.target.value });
    };

    onTextChange = (event) => {
        this.setState({ text: event.target.value });
    };

    addPost = async () => {
        if(this.state.title === "" || this.state.text === "") {
            this.setState({ errorMsg: "You need to type both title and message. "});
            return;
        }
        const newPost = {
            title: this.state.title,
            text: this.state.text,
            author: this.props.userId
        };

        const url = "/api/post";
        let response;

        try{
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });
        } catch (err) {

        }
        if(response.status === 401) {
            this.setState({ errorMsg: "You need to log in first"});
            return;
        }

        if(response.status === 201) {
            this.setState({ errorMsg: null});
            this.props.history.push('/');
        }
    }


// Insired by https://github.com/arcuri82/web_development_and_api_design/blob/master/les09/chat/websocket-full/src/client/index.jsx
render() {
    return (
        <div>
            <h2>New Post</h2>
            <div>
                <p className="inputName">Title:</p>
                <input id="inputTitle" type="text"
                    className="inputName"
                    onChange={this.onTitleChange} />
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

            <div id="sendBtn" className="btn" onClick={this.addPost}>Send</div>
            {this.state.errorMsg}
        </div>
    )
}

}

export default withRouter(NewPost);