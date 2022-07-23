const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const router = require('./router');
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use('/api', router);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(
      'mongodb://admin:admin@localhost:27017/admin',
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) {
          console.log(err);
        }
      },
    );
    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
