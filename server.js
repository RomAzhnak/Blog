const express = require("express");
const app = express();
const controllerAuth = require("./controllers/controller");
const db = require("./models");
const userReq = require("./routers/user.requests");
const adminReq = require("./routers/admin.requests");
const authReq = require("./routers/auth.requests");
const cors = require('cors');
const {errorHandler} = require("./middleware/errorHandler");

// function errorHandler(err, req, res, next) {
//   console.log(err);      
//   if (res.headersSent) {

//     return next(err)
//   }

//   res.status(500)
//   res.render('error', { error: err })
// }

// errorHandler = (err, req, res, next) => {
//   console.log(err);
//   switch (true) {
//       case typeof err === 'string':
//           // custom application error
//           const is404 = err.toLowerCase().endsWith('not found');
//           const statusCode = is404 ? 404 : 400;
//           return res.status(statusCode).json({ message: err });
//       case err.name === 'UnauthorizedError':
//           // jwt authentication error
//           return res.status(401).json({ message: 'Unauthorized' });
//       default:
//           return res.status(500).json({ message: err.message });
//   }
// }


global.__basedir = __dirname;
// global.baseURL = 'http://localhost:4000/'

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// });
// ({ alter: true }) - This checks what is the current state of 
// the table in the database (which columns it has, what are their 
//   data types, etc), and then performs the necessary changes in 
//   the table to make it match the model.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.get('/test', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

app.use("/auth", authReq);
app.use("/admin", adminReq);
app.use("/user", userReq);
app.use(errorHandler);


const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
