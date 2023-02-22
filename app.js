require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

//  rest pakages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

// middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(express.static('./public'));

// db
const connectDB = require('./db/connect');

// routes
const authRouter = require('./routes/AuthRouter');
const usersRouter = require('./routes/UsersRoutes');
const productsRouter = require('./routes/ProductRoutes');
const reviewRouter = require('./routes/ReviewRoutes');
const orderRouter = require('./routes/OrderRoutes');
const cartRouter = require('./routes/cartRoutes');

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/carts', cartRouter);

app.use('/api/v1/', (req, res) => {
  console.log(req.cookies.token);
  res.send('ecommerce');
});

// error middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { addItemToCart } = require('./controller/CartController');

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

const findTotal = (array) => {};

start();
