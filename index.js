//? Third Party packages...
//? express => to create server...
const express = require("express");
const app = express();
// ------------------
//? bcrypt => to secure Password...
const bcrypt = require("bcryptjs");
// ------------------
//? jwt => to verify user ...
const jwt = require("jsonwebtoken");
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
//? MONGODB package...
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const Mongo_Client_Url = process.env.MONGO_DB_URL;
// --------------------------------------------
//? authorize => Middleware for Api endpoints...
const authorize = (req, res, next) => {
  if (req.headers.authorization) {
    try {
      // ------------------
      const verify = jwt.verify(
        req.headers.authorization,
        process.env.SECRET_KEY
      );
      // ------------------
      if (verify) {
        next();
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
      // ------------------
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Unauthorized" });
    }
  }
};

// --------------------------------------------
//? Testing server...
app.get("/", async function (req, res) {
  res.send("👍Server Started");
});
// --------------------------------------------
//? GET Class_Contents ...
app.get("/Class-Contents", authorize, async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Class_Content");
    // ------------------
    //? 4) Do Operations :-
    const Get_Class_Content = await collection.find({}).toArray();
    // console.log(Get_Class_Content);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json(Get_Class_Content);
    // ------------------
  } catch (error) {
    console.error(error);
  }
});
// --------------------------------------------
//? GET Free_Courses ...
app.get("/Free-Courses", authorize, async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Free_Courses");
    // ------------------
    //? 4) Do Operations :-
    const Get_Free_Courses = await collection.find({}).toArray();
    // console.log(Get_Free_Courses);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json(Get_Free_Courses);
    // ------------------
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
    // ------------------
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Task_Submission");
    // ------------------
    //? 4) Do Operations :-
    const Get_Task_Submission = await collection
      .find({ Student_Email: Student_Email })
      .toArray();
    // console.log(Get_Task_Submission);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json(Get_Task_Submission);
    // ------------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------
//? POST Task_Activities ...
app.post("/Task-Submission", authorize, async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Task_Submission");
    // ------------------
    //? 4) Do Operations :-
    const Post_Task_Submission = await collection.insertOne(req.body);
    // console.log(Post_Task_Submission);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json({ message: "Successfully task added." });
    // ------------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// --------------------------------------------
//? POST QUERIES ...
app.post("/Create-Query", authorize, async function (req, res) {
  try {
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Queries");
    // ------------------
    //? 4) Do Operations :-
    const Post_Queries = await collection.insertOne(req.body);
    // console.log(Post_Task_Submission);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json({ message: "Successfully Query Created." });
    // ------------------
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
    // ------------------
    //? 1) Connect MongoDB :-
    const connection = await mongoclient.connect(Mongo_Client_Url);
    // ------------------
    //? 2) Select Database :-
    const db = connection.db("ZEN_CLASS_STUDENT_DB");
    // ------------------
    //? 3) Select Collection :-
    const collection = db.collection("Queries");
    // ------------------
    //? 4) Do Operations :-
    const Get_Assigned_Query = await collection
      .find({ Student_Email: Student_Email })
      .toArray();
    // console.log(Get_Task_Submission);
    // ------------------
    //? 5) Finally Close the Connection...
    await connection.close();
    res.json(Get_Assigned_Query);
    // ------------------
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});
// --------------------------------------------

//? STUDENT_REGISTRATION...

app.post("/Student-Registration", async function (req, res) {
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
app.post("/Student-Login", async function (req, res) {
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
//? SERVER RUNNING PORT ...
app.listen(PORT, () => console.log(`PORT is Running on - ${PORT}`));
// --------------------------------------------
