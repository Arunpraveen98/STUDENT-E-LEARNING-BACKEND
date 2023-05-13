const express = require("express");
const router = express.Router();
const { authorize } = require("../Authenticate");
require("dotenv").config();
//? MONGODB package...
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const Mongo_Client_Url = process.env.MONGO_DB_URL;
// ------------------

// --------------------------------------------
//? GET Class_Contents ...
router.get("/Class-Contents", authorize, async function (req, res) {
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
    const Get_Class_Content = await collection
      .find({})
      .sort({ id: 1 })
      .toArray();
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
router.get("/Free-Courses", authorize, async function (req, res) {
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
    const Get_Free_Courses = await collection
      .find({})
      .sort({ id: 1 })
      .toArray();
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
router.get("/Submitted-Task", authorize, async function (req, res) {
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
router.post("/Task-Submission", authorize, async function (req, res) {
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
router.post("/Create-Query", authorize, async function (req, res) {
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
router.get("/Assigned-Query", authorize, async function (req, res) {
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
const Student_Routes = router;
module.exports = Student_Routes;
