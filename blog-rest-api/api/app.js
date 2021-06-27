const config = require('config');
const debug = require('debug')('blog-api:server');
const express = require('express');
const mongoose = require('mongoose');

const authorRoutes = require('./routes/authorRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
var cors = require('cors')

// Mongoose connection
//const mongoUrl = config.get('mongoUrl');
const url = 'mongodb://teamB:asd123@cluster0-shard-00-00.szped.mongodb.net:27017,cluster0-shard-00-01.szped.mongodb.net:27017,cluster0-shard-00-02.szped.mongodb.net:27017/teambBackend?ssl=true&replicaSet=atlas-xqt4p7-shard-0&authSource=admin&retryWrites=true&w=majority'
//const mongoUrl = mongoose.connect(url)

//debug(`Connecting to ${url}`);

mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(() => {
  console.error('Unable to connect to MongoDB');
});
// usr cors to slove cross-origin resource
app.use(cors())
// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authors', authorRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((err, req, res, next) => {
  const formatError = ({ message, path, value }) => ({
    error: message,
    name: err.name,
    path,
    value,
  });

  switch (err.name) {
    case 'ValidationError':
      res.status(422).send(Object.values(err.errors)
        .map(val => formatError(val)));
      break;
    case 'CastError':
      res.status(422).send(formatError(err));
      break;
    case 'RequestValidationError':
      res.status(422).send(err.array());
      break;
    case 'NotFoundError':
      res.status(404).send(err);
      break;
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.name === 'MongoError' && err.code === 11000) {
    res.status(422).send({
      message: err.message,
      name: err.name,
    });
  } else {
    next(err);
  }
});

module.exports = app;
