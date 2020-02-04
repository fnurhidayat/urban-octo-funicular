const express = require('express');
const app = express();
const morgan = require('morgan');
const dotenv= require('dotenv');
const cors = require('cors');

dotenv.config();

const env = process.env.NODE_ENV;
const dbConnection = {
  development: process.env.DB_CONNECTION,
  test: process.env.DB_CONNECTION_TEST,
  staging: process.env.DB_CONNECTION,
  production: process.env.DB_CONNECTION
}

const mongoose = require('mongoose');
mongoose.connect(
  dbConnection[env],
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)
  .then(() => {
    if(process.env.NODE_ENV !== 'test') console.log('Database connected!')
  })
  .catch(err => console.log(err));
  
app.use(cors());
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

const router = require('./router.js');
app.use('/api/v1', router);

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    data: 'Hello World'
  })
})

module.exports = app;
