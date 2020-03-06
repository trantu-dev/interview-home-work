const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Post = require('./models/post.model');
const User = require('./models/user.model');
const Comment = require('./models/comment.model');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const posts = JSON.parse(fs.readFileSync(`${__dirname}/data/posts.json`));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`));
const comments = JSON.parse(fs.readFileSync(`${__dirname}/data/comments.json`));

const importData = async () => {
  try {
    await Post.create(posts);
    await User.create(users);
    await Comment.create(comments);

    console.log('Data imported');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Post.deleteMany();
    await User.deleteMany();
    await Comment.deleteMany();

    console.log('Data deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
