const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 8000;

app.use(express.json());
// --------------------------------------------
const cors = require("cors");
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
// --------------------------------------------
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const Mongo_Client_Url = process.env.MONGO_DB_URL;
// --------------------------------------------
const authorize = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      const verify = jwt.verify(
        req.headers.authorization,
        process.env.SECRET_KEY
      );
      if (verify) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};

// --------------------------------------------
//? GET Class_Contents ...
app.get("/Class-Contents", authorize, async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);

    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Class_Content");
    const Get_Class_Content = await collection.find({}).toArray();
    // console.log(Get_Class_Content);
    res.json(Get_Class_Content);
    await connection.close();
  } catch (error) {
    console.error(error);
  }
});
// --------------------------------------------
//? GET Free_Courses ...
app.get("/Free-Courses", authorize, async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Free_Courses");
    const Get_Free_Courses = await collection.find({}).toArray();
    // console.log(Get_Free_Courses);
    res.json(Get_Free_Courses);
    await connection.close();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? GET SUBMITTED TASK ...
app.get("/Submitted-Task", authorize, async function (req, res) {
  try {
    const Student_Email = req.query.Email;
    // console.log(Student_Email);
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Task_Submission");
    const Get_Task_Submission = await collection
      .find({ Student_Email: Student_Email })
      .toArray();
    // console.log(Get_Task_Submission);
    await connection.close();
    res.json(Get_Task_Submission);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? POST Task_Submission ...
app.post("/Task-Submission", authorize, async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Task_Submission");
    const Post_Task_Submission = await collection.insertOne(req.body);
    // console.log(Post_Task_Submission);
    await connection.close();
    res.json({ message: "Successfully task added." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --------------------------------------------
//? POST QUERIES ...
app.post("/Create-Query", authorize, async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Queries");
    const Post_Queries = await collection.insertOne(req.body);
    // console.log(Post_Task_Submission);
    await connection.close();
    res.json({ message: "Successfully Query Created." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? GET CREATED QUERY ...
app.get("/Assigned-Query", authorize, async function (req, res) {
  try {
    const Student_Email = req.query.Email;
    // console.log(Student_Email);
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    const collection = db.collection("Queries");
    const Get_Assigned_Query = await collection
      .find({ Student_Email: Student_Email })
      .toArray();
    // console.log(Get_Task_Submission);
    await connection.close();
    res.json(Get_Assigned_Query);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------

//? STUDENT_REGISTRATION...

app.post("/Student-Registration", async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_REGISTRATION");
    const collection = db.collection("Student_Registration");
    const Get_Email = await collection.findOne({
      Email: req.body.Email,
    });
    console.log(Get_Email);
    if (Get_Email === null) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.Password, salt);
      req.body.Password = hash;
      req.body.ConfirmPassword = hash;
      const Register_Student = await collection.insertOne(req.body);
      console.log(Register_Student);
      await connection.close();
      res.json({ message: "Successfully USER Registered..." });
    } else {
      res.json({ message: "Email already exists", Email: req.body.Email });
      await connection.close();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? STUDENT LOGIN ...
app.post("/Student-Login", async function (req, res) {
  try {
    const connection = await mongoclient.connect(Mongo_Client_Url);
    const db = connection.db("ZEN_CLASS_REGISTRATION");
    const collection = db.collection("Student_Registration");

    const Student_Login = await collection.findOne({ Email: req.body.Email });

    if (Student_Login) {
      const Compare = await bcrypt.compare(
        req.body.Password,
        Student_Login.Password
      );

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
      } else {
        res.json({ message: "Invalid Email/Password..." });
      }
    } else {
      res.status(401).json({ message: "Please Signup and Login" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? SERVER RUNNING PORT ...
app.listen(PORT, () => console.log(`PORT is Running on - ${PORT}`));
// --------------------------------------------
