const mongoose = require('mongoose');

const MONGO_URL = ''

mongoose.connection.once('connected', () => {
  console.log('Mongoose default connection is open');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error has occured \n${err}`);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};