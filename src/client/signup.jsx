// From https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/client/signup.jsx

import React from 'react';
import {withRouter} from 'react-router-dom'

class SignUp extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            userId: "",
            password: "",
            confirm: "",
            name: "",
            surname: "",
            dateOfBirth: "",
            location: "",
            errorMsg: null
        };
    }

    onUserIdChange = (event) => {
        this.setState({userId: event.target.value, errorMsg: null});
    };

    onPasswordChange = (event) => {
        this.setState({password: event.target.value, errorMsg: null});
    };

    onConfirmChange = (event) => {
        this.setState({confirm: event.target.value, errorMsg: null});
    };

    onNameChange = (event) => {
        this.setState({name: event.target.value, errorMsg: null});
    };

    onSurnameChange = (event) => {
        this.setState({surname: event.target.value, errorMsg: null});
    };

    onDateOfBirthChange = (event) => {
        this.setState({dateOfBirth: event.target.value, errorMsg: null});
    };

    onLocationChange = (event) => {
        this.setState({location: event.target.value, errorMsg: null});
    };
    
    doSignUp = async () => {

        const {userId, password, confirm, name, surname, dateOfBirth, location} = this.state;

        if(confirm !== password){
            this.setState({errorMsg: "Passwords do not match"});
            return;
        }

        const url = "/api/signup";

        const payload = {userId: userId, password: password, name: name, surname: surname,
            dateOfBirth: dateOfBirth, location: location};

        let response;

        try {
            response = await fetch(url, {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (err) {

        }


        if(response.status === 400){
            this.setState({errorMsg: "Invalid userId/password"});
            return;
        }

        if(response.status !== 201){
            this.setState({errorMsg: "Error when connecting to server: status code "+ response.status});
            return;
        }

        this.setState({errorMsg: null});
        this.props.updateLoggedInUserId(userId);
        this.props.history.push('/');
    };

    render(){

        let error = <div></div>;
        if(this.state.errorMsg !== null){
            error = <div className="errorMsg"><p>{this.state.errorMsg}</p></div>
        }

        let confirmMsg = "Ok";
        if(this.state.confirm !== this.state.password){
           confirmMsg = "Not matching";
        }

        return(
            <div>
                <div>
                    <p>User Id:</p>
                    <input id="userIdInput" type="text"
                           value={this.state.userId}
                           onChange={this.onUserIdChange}/>
                </div>
                <div>
                    <p>Password:</p>
                    <input id="passwordInput" type="password"
                           value={this.state.password}
                           onChange={this.onPasswordChange}/>
                </div>
                <div>
                    <p>Confirm:</p>
                    <input id="confirmInput" type="password"
                           value={this.state.confirm}
                           onChange={this.onConfirmChange}/>
                    <div>{confirmMsg}</div>
                </div>
                <div>
                    <p>Name:</p>
                    <input id="nameInput" type="text"
                           value={this.state.name}
                           onChange={this.onNameChange}/>
                </div>
                <div>
                    <p>Surname:</p>
                    <input id="surnameInput" type="text"
                           value={this.state.surname}
                           onChange={this.onSurnameChange}/>
                </div>
                <div>
                    <p>Date of birth:</p>
                    <input id="dobInput" type="text"
                           value={this.state.dateOfBirth}
                           onChange={this.onDateOfBirthChange}/>
                </div>
                <div>
                    <p>Location:</p>
                    <input id="locationInput" type="text"
                           value={this.state.location}
                           onChange={this.onLocationChange}/>
                </div>

                {error}

                <div id="signUpBtn" className="btn" onClick={this.doSignUp}>Sign Up</div>
            </div>
        );
    }
}

export default withRouter(SignUp);
