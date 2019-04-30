import React from 'react';
import { withRouter } from 'react-router-dom'

export class User extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            user: this.props.user
        };
    }

    componentWillReceiveProps(nextProp) {
        this.setState({ user: nextProp.user });
    }

    addFriend = (friend) => {
        this.setState({ addFriend: friend })
    }

    sendFriendRequest = async (friendId) => {
        const url = "/api/user?friendrequest=" + friendId;

        let response;
        try{
            response = await fetch(url, {
                method: "put"
            });
        } catch (err) {

        }
        if (response.status === 204) {
            this.setState({ addFriend: null });
        }
    }



    render() {
        let friends;
        if(this.state.user.friends !== undefined && this.state.user.friends !== null &&
            this.state.user.friends.length > 0)
            friends = <div className="postMessageContainer infoText">
                Friends:
                    {this.state.user.friends.map((friend, i) =>
                    <div key={i} className="link" onClick={() => this.addFriend(friend)}>
                        {friend}
                    </div>
                )}
            </div>

        let addFriend;
        addFriend = 
        <div>
            Are do you want to send {this.state.addFriend} a friend request? 
            <div className="link" onClick={() => this.sendFriendRequest(this.state.addFriend)}>Yes</div>
        </div>

        let friendReqSent = <div>
            Friend request sent!!
        </div>

        const user = this.state.user;
        return (
            <div className="postTextContainer postContainer">
                <div className="postMessageContainer infoText">
                    Name:
                    <p className="link" onClick={() => this.addFriend(user.userId)}>{user.name} {user.surname}</p>
                </div>
                <div className="postMessageContainer infoText">
                    Date of birth:
                    <p>{user.dateOfBirth}</p>
                </div>
                <div className="postMessageContainer infoText">
                    Location:
                    <p>{user.location}</p>
                </div>
                {friends}
                {this.state.addFriend &&
                    <div>
                        {addFriend}
                    </div>
                }
                {this.state.frendReqSent &&
                    <div>
                        {friendReqSent}
                    </div>
                }
            </div>
            )
        }
    }
    
export default withRouter(User)