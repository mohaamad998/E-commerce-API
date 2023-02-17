require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//  rest pakages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

// db
const connectDB = require('./db/connect');

// routes
const authRouter = require('./routes/AuthRouter');
const usersRouter = require('./routes/UsersRoutes')

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);

app.use('/api/v1/', (req, res) => {
  console.log(req.cookies.token);
  res.send('ecommerce');
});

// error middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

// start
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, (req, rest) => {
      console.log('server is starting');
    });
  } catch (error) {
    console.log(error);
  }
};

start();
