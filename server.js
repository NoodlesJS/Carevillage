const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;
dotenv.config();


app.use(morgan('common'));

app.use(express.static('public'));

// IMPORTED ROUTES
const userRoutes = require('./routes/userRoute');


// MIDDLEWARE
app.use(express.json());


// ROUTES
app.use('/api/user', userRoutes);

// SERVER RUN AND CLOSE
let server;

function runServer() {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(process.env.PORT||8080, () => {
            console.log(`DB connected and your app is listening on some port`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }
  

  if (require.main === module) {
    runServer(process.env.DB_CONNECT).catch(err => console.error(err));
  }

module.exports = {app, runServer, closeServer};