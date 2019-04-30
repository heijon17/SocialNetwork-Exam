# PG6301 Web Development and API Design Exam
by Jon-Martin Heiberg (heijon17 candidate: 100028)

#

>Test coverage: `60,63%`



How to run the project:
+ You need to have Yarn and Node.js installed.
+ Extract the .zip-file
+ Open terminal and go to the project `root` folder.
+ In the terminal run:

```bash
> yarn install
> yarn build
> yarn start
```

+ Open your web-browser and go to `http://localhost:8080/`
> Use the userIDs: `john, olab, perh` and password: `password` to log in.

#

## What does this project do?

This project is a lightweight simplified social media webapp. When a user log in, it displays all the posts from their friends on the timeline. When the user presses his/her name, the user-information appears, including friends, and all the users posts, in chronoligical order. At any time the user can toggle the chat and chat with other members of the social media community. When logged in, a user can also search for other users, see their info and send friend requests by clicking their names. It is possible to search for userID, name, surname and location. A logged in user can also add new posts to his/her timeline by clicking "New Post" in the top-menu. This new post will appear together with all the users posts on My Info page when clicking the users name. When the user gets new friend requests their name on the menu will start to flash. He/she can click on the name to see the request and accept or decline. If someone is not a member already he/she can sign up and create a new user to enjoy the community.

## The structure
File-structure:
> + public
> + src
>    + client
>    + server
>        + db
>        + gql
>        + routes
>        + ws
>    + shared
> + tests
>    + client
>    + server

* The `public` folder contains the static files, like .html and .css files.
* The `src` folder contains all the .js and .jsx files for both the clien and the server.
* The `db` folder inside `server` contains the fake databases.
* The `gql` folder inside `server` contains setup for GraphQL query api.
* The `routes` inside `server` extends the server with api-handling.
* The `ws` inside `server` handles WebSockets.
* The `shared` folder contains code shared with both client and server.
* The `tests` folder contains all the tests files for both client and server.

## Implementation and technologies
This project contains both a frontend (client) and backend (server) part. The frontend is built with React and the backend is built with Node.js using Express. The server supports HTTP and WebSocket protocol. It serves both static files and data from both RESTful API and GraphQL API, although both time and requirements of this exam made it difficult to actually use the GraphQL API, the server still supports it. The REST API supports GET, POST, PUT and DELETE calls, but a user needs to be authorized in order to be able to get any results.
When a user logs in, it handles authentication with cookies.
The app also has a built in chat based on WebSocket.

I have used les10 from class repository as a starting point and/or inspiration, and some of the code used in this project has been extended from this repository (commented in the code). Also some of the setup files are from this repository. (e.g jest-setup.js, .babelrc, webpack.config.js)
There are some requirements that I didn't manage to in time. Timeline updated in real-time with WebSockets is a cool feature that will be be implpemented in the final version. Also the ability to click on links is unavailable due to the importancy of implementing the security it requires.


