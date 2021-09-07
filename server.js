const express = require("express");
const app = express();
const controllerAuth = require("./controllers/auth.controller");
const db = require("./models");
const userReq = require("./routers/user.requests");
const cors = require('cors');

global.__basedir = __dirname;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// });
app.use(cors());
app.use(express.json());
// app.use((req,res,next) => {console.log(req.query.email);
//                 next()});
app.get('/test', (req, res) => {
  res.json({
    message: 'Hello'
  })
})

app.use("/auth", userReq);

app.get("/all", controllerAuth.allUser);

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
