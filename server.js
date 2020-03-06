const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const morgan = require('morgan');
const connectDB = require('./db');
const colors = require('colors');
const errorHandler = require('./controllers/error.controller');
const cookieParser = require('cookie-parser');

// CONNECT TO DB
connectDB();

const app = express();

// BODY PARSER
app.use(express.json());
app.use(cookieParser());

// LOGGING
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

// ROUTE
const postRouter = require('./routes/posts.route');
const authRouter = require('./routes/auth.route');
const userRouter = require('./routes/user.route');
const commentRouter = require('./routes/comment.route');

// MOUNT ROUTER
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`App listening on port ${PORT}!`.yellow.bold)
);

process.on('unhandledRejection', err => {
  console.log(`unhandledRejection: ${err.message}`.red);

  server.close(() => process.exit(1));
});
