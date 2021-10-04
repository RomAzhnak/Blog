const express = require("express");
const app = express();
const db = require("./models");
const userReq = require("./routers/user.requests");
const adminReq = require("./routers/admin.requests");
const authReq = require("./routers/auth.requests");
const postReq = require("./routers/post.requests");
const cors = require('cors');
const {errorHandler} = require("./middleware/errorHandler");
require('dotenv').config()
global.__basedir = __dirname;

// db.sequelize.sync();
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

app.use(express.static(__basedir + '/static'));
app.use("/api/auth", authReq);
app.use("/api/admin", adminReq);
app.use("/api/user", userReq);
app.use("/api/post", postReq);
app.use(errorHandler);

const port = process.env.PORT;

(async () => {
  try {
    await db.sequelize.sync()
    app.listen(port, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`Server is running on port ${port}.`);
    });
    
  } catch(e) {

  }
})()
