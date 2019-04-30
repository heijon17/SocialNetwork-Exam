// Inspired from https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/client/headerbar.jsx

import React from "react";
import { Link, withRouter } from "react-router-dom";
import Chat from './chat';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderChat: false,
            searchString: "",
            userId: this.props.userId || null,
            user: this.props.user
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ user: nextProps.user });
        this.checkFriendRequest(this.state.user);
    }

    doLogout = async () => {
        this.setState({ userId: null, user: null });
        const url = "/api/logout";
        let response;
        try {
            response = await fetch(url, { method: "post" });
        } catch (err) {

        }
        if (response.status !== 204) {
            alert("Error when connecting to server: status code " + response.status);
            return;
        }
        this.props.updateLoggedInUserId(null);
        this.props.history.push("/");
    };

    toggleChat = () => {
        this.setState({ renderChat: !this.state.renderChat })
    }

    stopFlash = () => {
        document.getElementById('myInfoBtn').className = 'menuLink';
    }

    onSearchChange = (event) => {
        this.setState({ searchString: event.target.value })
    }

    search = async () => {
        const url = "/api/user?find=" + this.state.searchString

        let response;
        let payload;
        try {
            response = await fetch(url);
            payload = await response.json();
        } catch (err) {

        }

        //Edited to use GraphQL
        // const query = "query=" + 
        //     encodeURIComponent("{getUser{name, surname, location}}");
        // const url = "/graphql?" + query;

        // let response;
        // let payload;

        // try{
        //     response = await fetch(url);
        //     payload = await response.json();
        // } catch (err) {
         
        // }
        // if (response.status === 200) {
        //     console.log(payload.data.getUser);
        // }
        


        this.props.updateSearchResults(payload);
        this.props.history.push('/');
        this.props.history.push('/search');
    }

    checkFriendRequest(user) {
        if (user) {
            if (user.friendRequest.length > 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }


    renderLoggedIn(user) {
        let className;
        if (this.checkFriendRequest(user)) {
            className = "requestFlash";
        } else {
            className = "menuLink";
        }

        return (
            <div className="nav">
                <li>
                    <Link to={"/newpost"}>New Post</Link>
                </li>
                <li>
                    <div id="logoutBtn" className="menuLink" onClick={this.doLogout}>
                        Logout
        </div>
                </li>
                <li>
                    <Link id="myInfoBtn" className={className} to="/myinfo" onClick={this.stopFlash}>Welcome {user.name}!</Link>
                </li>
            </div>
        );
    }

    renderNotLoggedIn() {
        return (
            <div className="nav">
                <li>
                    <Link id="loginBtn" to="/login">
                        LogIn
                    </Link>
                </li>
                <li>
                    <Link id="singupBtn" to="/signup">
                        SignUp
                    </Link>
                </li>

            </div>
        );
    }

    render() {
        let content;
        if (this.state.user === null || this.state.user === undefined) {
            content = this.renderNotLoggedIn();
        } else {
            content = this.renderLoggedIn(this.state.user);
        }

        return (
            <div>
                <div className="nav">
                    <h1 className="headerText">FaceWeb</h1>
                    <ul className="nav">
                        <li><Link to={"/"}>
                            Home
                            </Link>
                        </li>
                        <li>
                            <div id="toogleChatBtn" className="menuLink" onClick={this.toggleChat}>
                                Toggle Chat
                            </div>
                        </li>
                        {content}
                        <li>
                            <input id="inputSeach" type="search"
                                placeholder="Search user"
                                onChange={this.onSearchChange} />
                        </li>
                        <li>
                            <div id="searchBtn" className="menuLink" onClick={this.search}>
                                Go
                            </div>
                        </li>
                    </ul>
                </div>
                {this.state.renderChat &&
                    <Chat user={this.state.user} />
                }
            </div>
        );
    }
}

export default withRouter(Header);
