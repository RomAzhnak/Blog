const express = require("express");
const app = express();
const controllerAuth = require("./controllers/auth.controller");
const db = require("./models");
const userReq = require("./routers/user.requests");
const cors = require('cors');

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
// app.use((req,res,next) => {console.log(req.query.email);
//                 next()});
app.get('/test', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

app.use("/auth", userReq);

// app.get("/all", controllerAuth.allUser);

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
