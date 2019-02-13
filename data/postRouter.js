const express = require('express');
const Posts = require('./helpers/postPosts.js');

const router = express.Router();

router.get('/', (req, res) => {
    Posts
        .find()
        .then(posts => {
            res.status(200).json({posts})
        })
        .catch(() => {
            res.status(500).json({error: "The posts information could not be retrieved."});
    });
});

router.get('/:id', (req, res) => {
    const {id} = req.params;

    Posts
        .findById(id)
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

router.post('/', (req, res) => {
    const post = req.body;

    console.log(post.title, post.contents);

    Posts.insert(post)
        .then(post =>{
            if (!post.title || !post.contents) {
                Posts.findById(post.id).then(post =>
                res.status(201).json({post}))}
            else {
                res.status(400).json({error: "Please provide title and contents for the post."})
            }
        }
        )
        .catch(() => {
            res.status(500).json({error: "There was an error while saving the post to the database"})
        })
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    Posts
        .findById(id)
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

router.put('/:id', (req, res) =>{
    const {id} = req.params;
    const changes = req.body;

    Posts
        .update(id, changes)
        .then(updated => {
            if (!changes.title || !changes.contents) {
                res.status(400).json({error: "Please provide title and contents for the post."})
            }
            else if(updated) {
                Posts.findById(id).then(post =>
                    res.status(200).json({post}));
            } else {
                res.status(404).json({error: "The post with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The post information could not be modified."});
        });
});


module.exports = router;