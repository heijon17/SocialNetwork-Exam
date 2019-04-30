// From https://github.com/arcuri82/web_development_and_api_design/blob/master/les10/connect4-v2/src/server/routes/auth-api.js

const express = require('express')
const passport = require('passport');

const Users = require('../db/users');
const Tokens = require('../ws/tokens');


const router = express.Router();

router.post('/login', passport.authenticate('local'), (req, res) => {

    res.status(204).send();
});

router.post('/logout', function (req, res) {

    req.logout();
    res.status(204).send();
});


router.post('/signup', function (req, res) {

    const created = Users.create(
        req.body.userId,
        req.body.password,
        req.body.name,
        req.body.surname,
        req.body.dateOfBirth,
        req.body.location,
        []
    );

    if (!created) {
        res.status(400).send();
        return;
    }

    passport.authenticate('local')(req, res, () => {
        req.session.save((err) => {
            if (err) {
                res.status(500).send();
            } else {
                res.status(201).send();
            }
        });
    });
});

/*
    Create a one-time random token associated with the current
    logged in user, which is defined by the provided session cookie.
 */
router.post('/wstoken', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }

    const t = Tokens.createToken(req.user.id);

    res.status(201).json({ wstoken: t });
});

router.post('/user', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    const accepted = req.query['accepted'];

    if (accepted !== null && accepted !== undefined) {
        if (accepted) {
            Users.addFriend(req.body.userId, req.body.friendId)
        } else {
            Users.removeFriendRequest(req.body.userId, req.body.friendId);
        }
        res.status(201).send();
        return;
    }
    res.status(400).send();



});

router.delete('/user', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }
    Users.deleteUser(req.user.userId);
});

router.put('/user', function (req, res) {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    const friendId = req.query['friendrequest'];
    let success = false;
    if (friendId !== undefined && friendId !== null) {
        success = Users.addFriendRequest(req.user.userId, friendId);
    } else {
        const user = {
            userId: req.body.userId,
            password: req.body.password,
            name: req.body.name,
            surname: req.body.surname,
            dateOfBirth: req.body.dateOfBirth,
            location: req.body.location,
        }
        success = Users.updateUser(user.userId, user);
    }
    
    if (success) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }

})

router.get('/user', function (req, res) {

    if (!req.user) {
        res.status(401).send();
        return;
    }
    let data = { userId: req.user.userId };

    const userId = req.query['userId'];
    const userToFind = req.query['find'];
    if (userToFind !== undefined && userToFind !== null) {
        data = seachInArray(Users.getAll(), userToFind)
    }
    if (userId !== undefined && userId !== null) {
        data = Users.getUserData(userId);
    }

    res.status(200).json(data);
});

function seachInArray(array, string) {
    const searchString = string.toUpperCase();
    let newArray = [];
    if (array !== undefined) {
        array.map(obj => {
            if (obj.userId.toUpperCase().includes(searchString) ||
                obj.name.toUpperCase().includes(searchString) ||
                obj.surname.toUpperCase().includes(searchString) ||
                obj.location.toUpperCase().includes(searchString)) {
                newArray.push(obj);
            }
        });
    }
    return newArray;
}



module.exports = router;
