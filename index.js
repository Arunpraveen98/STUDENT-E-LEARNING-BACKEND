//? Third Party packages...
//? express => to create server...
const express = require("express");
const app = express();
const Auth_Routes = require("./Routes/Auth");
const Student_Routes = require("./Routes/Student");
// ------------------
//? dotenv => to enable environment variables...
const dotenv = require("dotenv").config();
// ------------------
//? SERVER PORT NUMBER...
const PORT = process.env.PORT || 8000;
// ------------------
app.use(express.json());
// --------------------------------------------
//? cors package => to allow origin...
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
// --------------------------------------------

//? Testing server...
app.get("/", async function (req, res) {
  res.send("🤷‍♂️Welcome to Student E-Learning Api!");
});
// --------------------------------------------

app.use("/Auth", Auth_Routes);
app.use("/Student", Student_Routes);
// --------------------------------------------
//? SERVER RUNNING PORT ...
app.listen(PORT, () => console.log(`PORT is Running on - ${PORT}`));
// --------------------------------------------
