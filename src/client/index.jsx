const React = require('react');
const ReactDom = require('react-dom');
const { BrowserRouter, Switch, Route } = require('react-router-dom');

const { Home } = require('./home');
import Header from './header';
import Login from './login';
import SignUp from './signup';
import MyInfo from './myInfo';
import NewPost from './newPost';
import Seach from './seach';



export class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            renderChat: false,
            results: null,
            user: null
        };
        
    
    }

    // From https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/client/index.jsx
    componentDidMount() {
        this.checkIfAlreadyLoggedIn();
    }
    
    // From https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/client/index.jsx
    async checkIfAlreadyLoggedIn() {
        const url = "/api/user";
        let response;
        try {
            response = await fetch(url, {
                method: "get"
            });
        } catch (err) {

        }

        if (response.status === 401) {
            this.updateLoggedInUserId(null);
            return;
        }

        if (response.status !== 200) {

        } else {
            const payload = await response.json();
            this.updateLoggedInUserId(payload.userId);
        }
    };

    getUserInfo = async (userId) => {
        const url = "/api/user?userId=" + userId;

        let response;
        try {
            response = await fetch(url);
        } catch (err) {
 
        }
        if (response.status === 401) {
            this.setState({ errorMsg: "You need to log in first" });
            return;
        }
        if (response.status !== 200) {
            this.setState({ errorMsg: "Something went wrong.." });
            return;
        }
        const userData = await response.json();
        this.setState({ user: userData });
    }

    updateLoggedInUserId = (userId) => {
        this.setState({ userId: userId });
        if(userId){
            this.getUserInfo(userId);
        } else {
            this.setState({ user: null });
        }
    };

    updateSearchResults = (results) => {
        this.setState({ results: results });
    };

    fourOFour() {
        return (
            <div>
                <h1>Error 404. NOT FOUND.</h1>
                <p>The page you requested is not available.</p>
            </div>
        )
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header userId={this.state.userId}
                        updateLoggedInUserId={this.updateLoggedInUserId}
                        updateSearchResults={this.updateSearchResults}
                        user={this.state.user}/>
                    <Switch>
                        <Route exact path="/" 
                            render={props => <Home {...props}
                            user={this.state.user} />} />
                        <Route exact path="/login"
                            render={props => <Login {...props}
                            userId={this.state.userId}
                            updateLoggedInUserId={this.updateLoggedInUserId} />} />
                        <Route exact path="/signup"
                            render={props => <SignUp {...props}
                            userId={this.state.userId}
                            updateLoggedInUserId={this.updateLoggedInUserId} />} />
                        <Route exact path="/myinfo"
                            render={props => <MyInfo {...props} 
                            userId={this.state.userId} />} />
                        <Route exact path="/newpost"
                            render={props => <NewPost {...props} 
                            userId={this.state.userId}
                            user={this.state.user} />} />
                        <Route exact path="/search"
                            render={props => <Seach {...props} 
                            results={this.state.results} />} />
                            
                        <Route component={this.fourOFour} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDom.render(<App />, document.getElementById('root'));