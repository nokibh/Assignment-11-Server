require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: ['https://assignment-11-89f3b.web.app', 'http://localhost:5173'],
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0w7vnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const foodsCollection = client.db('allFoods').collection('foods');
    const topFoodCollection = client.db('topFoods').collection('top');
    const orderCollection = client.db('orderFood').collection('order');
    app.get('/tops', async (req, res) => {
      const cursor = topFoodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post('/order', async (req, res) => {
      const addAll = req.body;
      console.log(addAll);
      const result = await orderCollection.insertOne(addAll);
      res.send(result);
    });
    app.get('/myorder/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await orderCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    app.get('/foods', async (req, res) => {
      const cursor = foodsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post('/tops', async (req, res) => {
      const addAll = req.body;
      console.log(addAll);
      const result = await topFoodCollection.insertOne(addAll);
      res.send(result);
    });
    // My food
    app.get('/myfood/:email', async (req, res) => {
      console.log(req.params.email);
      const result = await topFoodCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(result);
    });
    app.delete('/myfood/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await topFoodCollection.deleteOne(query);
      res.send(result);
    });
    // update
    app.get('/tops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await topFoodCollection.findOne(query);
      res.send(result);
    });
    app.put('/tops/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFood = req.body;
      const food = {
        $set: {
          food_name: updatedFood.food_name,
          food_qun: updatedFood.food_qun,
          category: updatedFood.category,
          price: updatedFood.price,
          description: updatedFood.description,
          food_image: updatedFood.food_image,
        },
      };
      const result = await topFoodCollection.updateOne(filter, food, options);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    // await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Assignment-11-server is running');
});
app.listen(port, () => {
  console.log(`Assignment 11 server is running on Port${port}`);
});
