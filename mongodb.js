'use strict';

const { MongoClient } = require('mongodb');

const uri = 'your_mongodb_uri'; // Replace 'your_mongodb_uri' with your actual MongoDB connection string
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(uri, options);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

module.exports = { connect, client };