const express = require('express');
const Users = require('./helpers/userDb.js');
const Posts = require('./helpers/postDb.js');
const router = express.Router();

function checkCase(){
    return function(req, res, next){
      const name = req.body.name;
        console.log(name);
      if (name.split('')[0] === name.split('')[0].toUpperCase()){
        next();
      }
      else {
        res.status(401).json({message: 'nope'})
      }
    }
  
  }

router.get('/users', checkCase => {
    Users
        .get()
        .then(users => {
            res.status(200).json({users})
        })
        .catch(() => {
            res.status(500).json({error: "The users information could not be retrieved."});
    });
});


router.get('/users/:userId', checkCase, (req, res) => {
    const {userId} = req.params;

    Users
        .getById(userId)
        .then(user => {
            if(user){
                res.status(200).json({user})
            } else {
                res.status(404).json({error: "The user with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The user information could not be retrieved."});
    });
});

router.post('/users', (req, res) => {
    const user = req.body;

    console.log(user.name);

    Users.insert(user)
        .then(user =>{
            if (!user.name) {
                Users.getById(user.id).then(user =>
                res.status(201).json({user}))}
            else {
                res.status(400).json({error: "Please provide a name for the user."})
            }
        }
        )
        .catch(() => {
            res.status(500).json({error: "There was an error while saving the user to the database"})
        })
});

router.delete('/users/:userId', (req, res) => {
    const {userId} = req.params;

    Users
        .getById(userId)
        .then(user => {
            if(user){
                Users.remove(userId).then(
                res.status(200).json({deleted: true, user}))
            } else {
                res.status(404).json({error: "The user with the specified ID does not exist."})
            }})
        .catch(() => {
            res.status(500).json({error: "The user could not be removed."})
        });
});

router.put('/users/:userId', (req, res) =>{
    const {userId} = req.params;
    const changes = req.body;

    Users
        .update(userId, changes)
        .then(updated => {
            if (!changes.name) {
                res.status(400).json({error: "Please provide a new name for the user."})
            }
            else if(updated) {
                Users.getById(userId).then(user =>
                    res.status(200).json({user}));
            } else {
                res.status(404).json({error: "The user with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The user information could not be modified."});
        });
});

router.get('/users/:userId/posts/', (req, res) => {
    const {userId} = req.params;
    Users
        .getUserPosts(userId)
        .then(posts => {
            res.status(200).json({posts})
        })
        .catch(() => {
            res.status(500).json({error: "The posts information could not be retrieved."});
    });
});

router.get('/users/:userId/posts/:id', (req, res) => {
    const {id} = req.params;
    const {userId} =req.params;

    Users
        .getUserPosts(userId)
        .then(posts => {
            if(posts.id == id){
                res.status(200).json({posts})
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


    Posts.insert(post)
        .then(post =>{
            if (!post.title || !post.contents) {
                Posts.getById(post.id).then(post =>
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

module.exports = router;