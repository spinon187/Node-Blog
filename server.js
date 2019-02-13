const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const userRouter = require('./data/userRouter.js');

const server = express();

server.use(express.json());
server.use(helmet());
server.use(morgan('dev'));


server.use('/api/users/', userRouter);

function checkCase(){
  return function(req, res, next){
    const name = req.body.name;

    if (name.split()[0] === name.split()[0].toUpperCase()){
      next();
    }
    else {
      res.status(401).json({message: 'nope'})
    }
  }

}


function errorHandler(err, req, res, next){
  res.status(400).json({message: 'nawww'});
}

server.get('/', (req, res) => {
    res.send(`<h2>hi</h2>`)
  });

server.use(errorHandler);



module.exports = server;