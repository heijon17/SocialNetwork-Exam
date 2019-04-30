// Inspired by https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/app.js

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const resolvers = require('./gql/resolvers');
const typeDefs = require('./gql/schema');

const authApi = require('./routes/auth-api');
const postsApi = require('./routes/posts-api');
const wsHandler = require('./ws/wsHandler');

const Users = require('./db/users');

const app = express();


app.use(bodyParser.json());
wsHandler.init(app);
app.use(session({
    secret: 'encryption key for cookies',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static('public'));

passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'password'
},
    function (userId, password, done) {
        const verified = Users.verify(userId, password);
        if (!verified) {
            return done(null, false, { message: 'Invalid username or password' });
        }
        const user = Users.get(userId);
        return done(null, user);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user.userId);
});

passport.deserializeUser(function (userId, done) {
    const user = Users.get(userId);
    if(user !== null) {
        done(null, user);
    } else {
        done(null, false);
    }
});

app.use(passport.initialize());
app.use(passport.session());

//Graphql
const apollo = new ApolloServer({ typeDefs, resolvers });
apollo.applyMiddleware({ app, path: "/graphql" });


//make routes
app.use('/api', authApi);
app.use('/api', postsApi);

app.all('/api*', (req, res) => {
    res.status(404).send();
});

app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = {app};

