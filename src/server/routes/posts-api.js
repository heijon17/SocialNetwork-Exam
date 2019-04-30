const express = require('express')

const router = express.Router();

const Posts = require('../db/posts');

router.get('/post', (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    }

    //Get posts by id
    const id = req.query['id'];
    let data;
    if(id !== undefined && id !== null) {
        data = Posts.get(id);
    } 

    //Get posts by authorId
    const authorId = req.query['authorId'];
    if(authorId !== undefined && authorId !== null) {
        data = Posts.getAll().filter( post => {
            return post.authorId === authorId
        });
    } else {
        data = Posts.getAll();
    }
    res.json(data);
});

router.post('/post', (req, res) => {
    if (!req.user) {
        res.status(401).send();
        return;
    } 
    const post = Posts.newPost(req.body.title, req.body.text, req.body.author);
    if(post === null) {
        res.status(400).send();
    } else {
        res.status(201).send();
    }
});


module.exports = router;