const Users = require('./users');


const posts = new Map();

let counter = 0;

// From https://github.com/arcuri82/web_development_and_api_design/blob/master/les11/forum/src/server/db.js
const createId = () => {
    const id = "id" + counter;
    counter++;
    return id;
};

function get(id) {
    return posts.get(id);
};

function getAll() {
    return Array.from(posts.values());
};

function newPost(title, text, authorId) {
    if (!Users.get(authorId)) {
        return null
    }
    const id = createId();
    posts.set(id, {id, title, text, authorId, comments: []});

    return id;
};

function clear() {
    posts.clear();
}

function initWithDemoData() {
    newPost("Hello you", "I saw you yesterday", "john");
    newPost("Look at this", "This is totally awesome", "olab");
    newPost("I totally agree", "I saw it too", "john");
    newPost("Help", "I have no friends..", "perh");
    newPost("Hello you12", "I saw you yesterday", "john");
    newPost("Look at this too", "This is totally awesome", "olab");
    newPost("I totally not agree", "I saw it too", "john");
    newPost("New Car!", "I just bought this new car", "olab");
    newPost("The dark side", "The moon has both a bright and dark side..", "perh");
    newPost("How can i sleep longer?", "I tend to wake up at 05.00 every morning..", "perh");
    newPost("97% will fail on this", "What is 10+4+banana+sho+monkey-2*dog?", "olab");
    newPost("Happy wife...", "...happy life", "john");
    newPost("This view!", "I whish i could fly...", "olab");
    newPost("Get friends, they said", "Join the new social media community, they said..", "perh");

}

module.exports = {get, getAll, newPost, initWithDemoData, clear};