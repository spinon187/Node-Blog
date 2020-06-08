const express = require('express');
const Posts = require('./helpers/postDb.js');
const Users = require('./helpers/userDb.js');

const postRouter = express.Router({ mergeParams: true });

postRouter.get('/', (req, res) => {
    const userId = req.params.user_id;
    console.log(userId);
    Users
        .getUserPosts(userId)
        .then(posts => {
            res.status(200).json({posts})
        })
        .catch(() => {
            res.status(500).json({error: "The posts information could not be retrieved."});
    });
});

postRouter.get('/:id', (req, res) => {
    const {id} = req.params;

    Posts
        .getById(id)
        .then(post => {
            if(post){
                res.status(200).json({post})
            } else {
                res.status(404).json({error: "The post with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The post information could not be retrieved."});
    });
});


postRouter.post('/', (req, res) => {
    const userId = req.params.user_id
    const text = req.body.text;

    const taggedPost = {text, user_id: userId};

    Posts.insert(taggedPost)
        .then(taggedPost =>{
            if (taggedPost.text) {
                Posts.getById(taggedPost.id).then(taggedPost =>
                res.status(201).json({taggedPost}))}
            else {
                res.status(400).json({error: "Please provide text for the post."})
            }
        }
        )
        .catch(() => {
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
});

postRouter.delete('/:id', (req, res) => {
    const {id} = req.params;

    Posts
        .getById(id)
        .then(post => {
            if(post){
                Posts.remove(id).then(
                res.status(200).json({deleted: true, post}))
            } else {
                res.status(404).json({error: "The post with the specified ID does not exist."})
            }})
        .catch(() => {
            res.status(500).json({error: "The post could not be removed."})
        });
});

postRouter.put('/:id', (req, res) =>{
    const {id} = req.params;
    const changes = req.body;

    Posts
        .update(id, changes)
        .then(updated => {
            if (!changes.text) {
                res.status(400).json({error: "Please provide new text for the post."})
            }
            else if(updated) {
                Posts.getById(id).then(post =>
                    res.status(200).json({post}));
            } else {
                res.status(404).json({error: "The post with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The post information could not be modified."});
        });
});



module.exports = postRouter;