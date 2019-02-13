const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const userRouter = require('./data/userRouter.js');
const postRouter = require('./data/postRouter.js');

const server = express();

function teamNamer(req, res, next){
  req.team = 'Web XVI';

  next();
}

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));
server.use(teamNamer);


server.use('/api/users', restricted, userRouter);
server.use(`/api/users/${id}/posts`, restricted({id}), postRouter);

function restricted(req, res, next){
  const password = req.headers.authorization;

  if (password === 'mellon'){
    next();
  }
  else {
    res.status(401).json({message: 'nope'})
  }
}

function errorHandler(err, req, res, next){
  res.status(400).json({message: 'nawww'});
}

server.get('/', (req, res) => {
    if (req.headers.name === 'po'){res.send(`
      <h2>Lambda Hubs API</h2>
      <p>Welcome ${req.team}, to the Lambda Hubs API</p>
    `);} else {
      next('any argument will become err arg')
    }
  });

erver.use(errorHandler);



module.exports = server;