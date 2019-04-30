const React = require('react');
import { withRouter } from 'react-router-dom';
import PostComponent from './postComponent';
import User from './user';
import UserUtil from './util/user';

export class MyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMsg: null,
            posts: null,
            loadedUser: false
        }
    }

    componentWillMount() {
        const usr = UserUtil.getCurrent();
        this.setState({ user: usr });
        this.getUserInfo(this.props.userId);
    }

    componentDidMount() {
        this.getUserPosts(this.props.userId);
    }

    componentWillReceiveProps(prevProps) {
        if(prevProps.userId !== this.props.userId && this.props.userid){
            this.getUserInfo();
        }
    }

    componentWillUnmount() {
        UserUtil.setCurrent(this.state.user);
    }

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
        this.setState({ 
            user: userData,
            loadedUser: true
         });

    }

    getUserPosts = async (userId) => {
        const url = "/api/post?authorId=" + userId;

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
        const postsData = await response.json();
        this.setState({ posts: postsData });
    }

    checkFriendRequest(user) {
        if (user.friendRequest && user.friendRequest !== undefined) {
            if (user.friendRequest.length > 0) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    acceptFriendReq = async (friendId) => {
        const url = "/api/user?accepted=true";
        const payload = { userId: this.state.user.userId, friendId: friendId };

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
        if (response.status !== 201) {
            this.setState({ errorMsg: "Error when connecting to server: status code " + response.status });
            return;
        }
        this.removeFriendRequest(friendId);
    }

    declineFriendReq = async (friendId) => {
        this.removeFriendRequest(friendId);
    }

    removeFriendRequest = (friendId) => {
        const _user = this.state.user;
        const i = _user.friendRequest.indexOf(friendId);
        if (i !== -1) _user.friendRequest.splice(i, 1);
        _user.friends.push(friendId);
        this.setState({ user: _user });
    }

    renderUserInfo(user) {
        return (
            <div>
                <User user={user} />
            </div>
        )
    }



    render() {

        let friendRequest;
        if (this.checkFriendRequest(this.state.user)) {
            friendRequest =
                <div>
                    <h3>You have {this.state.user.friendRequest.length} new friend requests.</h3>
                    <p>From: </p>{this.state.user.friendRequest.map((userId, i) =>
                        <div className="postTextContainer" key={i}>
                            <div className="postAuthor">
                                {userId}
                            </div>

                            <div>
                                <span id="acceptFriendBtn" className="link" onClick={() => this.acceptFriendReq(userId)}>Accept</span>
                                <span id="declineFriendBtn" className="link" onClick={() => this.declineFriendReq(userId)}>Decline</span>
                            </div>
                        </div>

                    )}
                </div>
        }

        let posts;
        let postsReverse;
        if (this.state.posts === null || this.state.posts.length === 0) {
            posts = <p>No posts by this user.</p>
        } else {
            postsReverse = this.state.posts.reverse();
            posts = <div>
                {this.state.posts.map((post, i) =>
                    <div key={i}>
                        <PostComponent post={post} />
                        <br />
                    </div>
                )}
            </div>
        }

        let userInfo;
        
   
        if (this.state.loadedUser) {
            userInfo = this.renderUserInfo(this.state.user);
        } else {
            userInfo = this.state.errorMsg;
        }


        return (
            <div>
                {friendRequest}
                <h2>My information</h2>
                {userInfo}
                <h2>My posts:</h2>
                {posts}
            </div>
        )
    }
}

export default withRouter(MyInfo);