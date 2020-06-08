const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const userRouter = require('./data/userRouter.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));


server.use('/api/users/', userRouter);




function errorHandler(err, req, res, next){
  res.status(400).json({message: 'nawww'});
}

server.get('/', (req, res) => {
    res.send(`<h2>hi</h2>`)
  });

server.use(errorHandler);



module.exports = server;