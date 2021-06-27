const config = require('config');
const faker = require('faker');
const mongoose = require('mongoose');

const Author = require('./api/models/authorModel');
const Comment = require('./api/models/commentModel');
const Post = require('./api/models/postModel');
const User = require('./api/models/userModel');

/*const mongoUrl = config.get('mongoUrl');*/
var url = 'mongodb://teamB:asd123@cluster0-shard-00-00.szped.mongodb.net:27017,cluster0-shard-00-01.szped.mongodb.net:27017,cluster0-shard-00-02.szped.mongodb.net:27017/teambBackend?ssl=true&replicaSet=atlas-xqt4p7-shard-0&authSource=admin&retryWrites=true&w=majority'
//const mongoUrl = mongoose.connect(url)


faker.locale = 'pt_BR';

function randomId(arr) {
  return arr[Math.floor(Math.random() * arr.length)].id;
}

mongoose.connect(url, {
  useCreateIndex: true,
  useNewUrlParser: true,
})
  .then(() => Promise.all([
    Author.deleteMany({}),
    Post.deleteMany({}),
    Comment.deleteMany({}),
    User.deleteMany({}),
  ]))
  .then(() => {
    const users = [...new Array(50)]
      .map(() => new User({
        name: faker.name.findName(),
        email: faker.internet.exampleEmail(),
      }));

    const authors = [...new Array(10)]
      .map(() => new Author({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      }));

    const comments = [...new Array(100)]
      .map(() => new Comment({
        content: faker.lorem.words(),
        user: randomId(users),
      }));

    const posts = [...new Array(10)]
      .map(() => new Post({
        title: faker.lorem.words(),
        subtitle: faker.lorem.words(),
        content: faker.lorem.paragraphs(),
        authors: [randomId(authors)],
        comments: [...new Array(10)]
          .map(() => randomId(comments)),
      }));

    posts.push(new Post({
      title: 'Um título qualquer',
      content: faker.lorem.paragraphs(),
      authors: [randomId(authors)],
      comments: [...new Array(10)]
        .map(() => randomId(comments)),
    }));

    return Promise.all([
      ...(users.map(user => user.save())),
      ...(authors.map(author => author.save())),
      ...(comments.map(comment => comment.save())),
      ...(posts.map(post => post.save())),
    ]);
  })
  .then(() => {
    console.log(`Data stored in ${url}`);
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });
