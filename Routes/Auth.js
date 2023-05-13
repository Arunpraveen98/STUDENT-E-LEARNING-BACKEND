const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
require("dotenv").config();
//? MONGODB package...
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const Mongo_Client_Url = process.env.MONGO_DB_URL;
// ------------------
//? STUDENT_REGISTRATION...

router.post("/Student-Registration", async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_REGISTRATION");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Student_Registration");
    // ------------------
    //? 4) Do Operations :-
    const Get_Email = await collection.findOne({
      Email: req.body.Email,
    });
    // console.log(Get_Email);
    // ------------------
    //? Checking Email already exists or not ...
    if (Get_Email === null) {
      //? Generate salt random data...
      const salt = await bcrypt.genSalt(10);
      //? hash function to encrypt the password...
      const hash = await bcrypt.hash(req.body.Password, salt);
      req.body.Password = hash;
      req.body.ConfirmPassword = hash;
      const Register_Student = await collection.insertOne(req.body);
      // console.log(Register_Student);
      // ------------------
      //? 5) Finally Close the Connection...
      await connection.close();
      res.json({ message: "Successfully USER Registered..." });
      // ------------------
    } else {
      res.json({ message: "Email already exists", Email: req.body.Email });
      //? 5) Finally Close the Connection...
      await connection.close();
      // ------------------
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------

//? STUDENT LOGIN ...
router.post("/Student-Login", async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_REGISTRATION");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Student_Registration");
    // ------------------
    //? 4) Do Operations :-
    const Student_Login = await collection.findOne({ Email: req.body.Email });
    // ------------------
    //? If Email is there means then we have to compare the Password...
    if (Student_Login) {
      const Compare = await bcrypt.compare(
        req.body.Password,
        Student_Login.Password
      );
      // ------------------
      //? If Password true means then we have to Generate the jwt token...
      if (Compare) {
        const token = jwt.sign(
          { id: Student_Login._id },
          process.env.SECRET_KEY,
          {
            expiresIn: process.env.TOKEN_TIME_OUT,
          }
        );
        res.status(200).json({
          message: "Login Success",
          token,
          Student_Email: Student_Login.Email,
          Student_Name: `${Student_Login.FirstName} ${Student_Login.LastName}`,
        });
        //? 5) Finally Close the Connection...
        await connection.close();
        // ------------------
      } else {
        res.json({ message: "Invalid Email/Password..." });
        //? 5) Finally Close the Connection...
        await connection.close();
      }
      // ------------------
    } else {
      res.status(401).json({ message: "Please Signup and Login" });
      //? 5) Finally Close the Connection...
      await connection.close();
    }
    // ------------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------

const Auth_Routes = router;
module.exports = Auth_Routes;
