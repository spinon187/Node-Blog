const express = require('express');
const Users = require('./helpers/userDb.js');
const postRouter = require('./postRouter.js');

const router = express.Router();
router.use('/:user_id/posts', postRouter);

router.get('/', (req, res) => {
    Users
        .get()
        .then(users => {
            res.status(200).json({users})
        })
        .catch(() => {
            res.status(500).json({error: "The users information could not be retrieved."});
    });
});

router.get('/:user_id', (req, res) => {
    const {user_id} = req.params;

    Users
        .getById(user_id)
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

router.post('/', (req, res) => {
    const user = req.body;

    console.log(user.name);

    Users.insert(user)
        .then(user =>{
            if (user.name) {
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

router.delete('/:user_id', (req, res) => {
    const {user_id} = req.params;

    Users
        .getUserPosts(user_id)
        .then(posts => posts.forEach(post => postRouter.delete(`:${post.id}`))
            
        )


    // Users
    //     .getById(user_id)
    //     .then(user => {
    //         if(user){
    //             Users.remove(id).then(
    //             res.status(200).json({deleted: true, user}))
    //         } else {
    //             res.status(404).json({error: "The user with the specified ID does not exist."})
    //         }})
        .catch(() => {
            res.status(500).json({error: "The user could not be removed."})
        });
});

router.put('/:user_id', (req, res) =>{
    const {user_id} = req.params;
    const changes = req.body;

    Users
        .update(user_id, changes)
        .then(updated => {
            if (!changes.name) {
                res.status(400).json({error: "Please provide a new name for the user."})
            }
            else if(updated) {
                Users.getById(user_id).then(user =>
                    res.status(200).json({user}));
            } else {
                res.status(404).json({error: "The user with the specified ID does not exist."})
            }
        })
        .catch(() => {
            res.status(500).json({error: "The user information could not be modified."});
        });
});


module.exports = router;