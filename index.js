const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const uri =
  "mongodb+srv://Asad:Asad123@cluster0.lyfcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const collection = client.db("todos").collection("tasks");

  // Read
  app.get("/taskLists", (req, res) => {
    collection.find({}).toArray((err, docs) => res.send(docs));
  });

  app.get("/taskLists/:id", (req, res) => {
    collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, docs) => res.send(docs[0]));
  });

  // Create
  app.post("/addTasks", (req, res) => {
    const todo = req.body;
    console.log(todo);
    collection.insertOne(todo).then((result) => {
      res.redirect("/");
    });
  });

  // Update
  app.patch("/updateTask/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        { $set: { task: req.body.editTaskValue, time: req.body.editTimeValue } }
      )
      .then((result) => res.send(result.modifiedCount > 0));
  });

  // Delete
  app.delete("/deleteTask/:id", (req, res) => {
    console.log(req.params.id);
    collection.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  console.log("DB Connected");
});

app.listen(4000, () => {
  console.log("Calling port 4000");
});
