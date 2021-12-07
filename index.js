const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth.js');
const ProductsRoute = require('./routes/product');
const cors = require('cors');
dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('db connect'))
  .catch((err) => console.log(err));
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', ProductsRoute);
app.listen(process.env.PORT || 5000, () => {
  console.log('Server Start');
});
