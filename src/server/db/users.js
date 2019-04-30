// Inspired by https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/db/users.js

const users = new Map();



function verify(userId, password) {
    const user = get(userId);
    if(user === undefined) {
        return false;
    }
    return user.password === password;
}

function getUserData(userId) {
    const user = users.get(userId);
    return {
        userId: user.userId,
        name: user.name,
        surname: user.surname,
        dateOfBirth: user.dateOfBirth,
        location: user.location,
        friends: user.friends,
        friendRequest: user.friendRequest
    }
}

function getAll() {
    return Array.from(users.values());
}

function get(userId) {
    return users.get(userId);
}

function removeFriendRequest(userId, friendId, usr) {
    if (usr) {
        const i = usr.friendRequest.indexOf(friendId);
        if (i !== -1) {
            usr.friendRequest.splice(i, 1);
        }
        users.set(usr.userId, usr);
    } else {
        const user = get(userId);
        const i = user.friends.indexOf(friendId);
        if(i !== -1) user.friends.splice(i, 1);
        users.set(userId, user);
    }
}

function addFriendRequest(userId, friendId) {
    if(users.get(userId)){
        const user = get(userId);
        user.friendRequest.push(friendId);
        users.set(userId, user);
        return true;
    }
    return false;
}

function addFriend(userId, friendId) {
    const user =  users.get(userId);
    user.friends.push(friendId);
    users.delete(userId);
    removeFriendRequest(null, friendId, user);
}

function create(userId, password, name, surname, dateOfBirth, location, friends) {
    if(get(userId) !== undefined) {
        return false
    };

    const user = {
        userId: userId,
        password: password,
        name: name,
        surname: surname,
        dateOfBirth: dateOfBirth,
        location: location,
        friends: friends,
        friendRequest: []
    };

    users.set(userId, user);
    return true;
}

function deleteUser(userId) {
    users.delete(userId);
}

function updateUser(userId, user) {
    if(users.get(userId)) {
        users.set(userId, user);
        return true;
    }
    return false;
}

function initWithDemoUser() {
    users.clear();
    create("john", "password", "John", "Stone", "16-01-1983", "Oslo", ["olab", "perh"]);
    create("olab", "password", "Ola", "Birk", "17-06-1983", "Bergen", ["john"]);
    create("perh", "password", "Per", "Henriksen", "20-12-1986", "Bergen", ["john"]);
    addFriendRequest("john", "simen");
}

module.exports = {verify, get, create, initWithDemoUser, getUserData,
            getAll, addFriendRequest, removeFriendRequest, addFriend,
            deleteUser, updateUser};