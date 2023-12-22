const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.sztfigr.mongodb.net/?retryWrites=true&w=majority`; */


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@atlascluster.sztfigr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const taskCollection = client.db("taskHubDB").collection("alltasks");
   


    // Load all tasks
    app.get("/allTasks", async (req, res) => {
      // console.log("This email1111", req.query?.email)
      let query = {};
      if (req.query?.email) {
        query = { userEmail: req.query.email };
        // console.log("This email", req.query.email);
      }
      
      const result = await taskCollection.find(query).toArray();
        res.send(result);
      
    });
   
    // Post new task
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      // console.log(newTask);
      const result = await taskCollection.insertOne(newTask);
      res.send(result);
    });


    // Comment update
/*     app.patch("/updateComment/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const filter = { _id: new ObjectId(id) };
      const getPreviousComment = req.body;
      // console.log(getPreviousComment);
      const updateComment = {
        $set: {
          commentsCount: getPreviousComment.commentsCount + 1,
        },
      };
      const result = await postCollection.updateOne(filter, updateComment);
      res.send(result);
    }); */

    // Delete post 
    app.delete('/tasks/delete/:id', async(req, res) => {
      // const id = req.query.id;
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)};
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// default checkup
app.get("/", async (req, res) => {
  res.send("This TaskHub Running");
});
app.listen(port, () => {
  console.log(`The server is running on ${port}`);
});
