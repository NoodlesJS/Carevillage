const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.Promise = global.Promise;
dotenv.config();


// app.use(morgan('common'));

app.use(express.static('public'));

// IMPORTED ROUTES
const userRoutes = require('./routes/userRoute');
const medsRoutes = require('./routes/medsRoute');

// MIDDLEWARE
app.use(express.json());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  next();
});

// ROUTES
app.use('/api/user', userRoutes);
app.use('/api/meds', medsRoutes);
app.use("*", (req, res) => {
  return res.status(404).json({ message: "Not Found" });
});

// SERVER RUN AND CLOSE
let server;
let port = process.env.PORT||8080;

function runServer() {
    return new Promise((resolve, reject) => {
      mongoose.connect(process.env.DB_CONNECT || 'mongodb://localhost/carevillage-test-DB', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, err => {
        if (err) {
          return reject(err);
        }
        server = app
          .listen(port, () => {
            console.log(`DB connected and your app is listening on ${port}`);
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