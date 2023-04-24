const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// API routes
const categories = require('./routes/categoryRoutes');
const questions = require('./routes/questionRoutes');
const games = require('./routes/gameRoutes');

db.on('error', console.error.bind(console, 'Connection error'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(express.json());

app.use('/', categories);
app.use('/', questions);
app.use('/', games);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
