const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors())
app.use(express.json())
require('dotenv').config()

const jwt = require('jsonwebtoken');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@lateef-creation-portfol.s0jnuyt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: 'UnAuthorized access' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: 'forbidden access' })
    }
    req.decoded = decoded;
    next();
  });
}

async function run() {
  try {

    const portfolioData = client.db('portfolio').collection('portfolio-data');
    const userCollection = client.db('portfolio').collection('user');

    app.get('/portfolio-data', async (req, res) => {
      const query = {};
      const cursor = await portfolioData.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });
    app.get('/category/:categoryName', async(req, res)=>{
      const categoryName = req.params.categoryName;
      const query = {category: categoryName}
      // console.log(query)
      const cursor = await portfolioData.find(query)
      const data = await cursor.toArray();

      res.send(data)
    })


    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { uid: id }
      const result = await userCollection.findOne(query)
      res.send(result)
    });


    app.get('/portfolio-admin-data', verifyJWT, async (req, res) => {
      const query = {};
      const cursor = await portfolioData.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    app.post('/portfolio-upload', verifyJWT, (req, res) => {
      const addData = req.body;
      const result = portfolioData.insertOne(addData)
      res.send(result)

    })

    app.delete('/portfolio-data/:id', verifyJWT, async(req, res) =>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await portfolioData.deleteOne(query);
      res.send(result);
    })

    app.put('/user/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN, { expiresIn: '24h' });
      res.send({ result, token });
    })

    app.put('/portfolio-admin-data', verifyJWT, async (req, res) => {
      const newPortfolio = req.body;
      console.log(newPortfolio)
      // const options = { upsert: true };
      // try {
      //   for (let i = 0; i < newPortfolio.length; i++) {
      //     const { _id, ...updateData } = newPortfolio[i];
      //     console.log(`Updating document with id ${_id}`);
      //     // console.log(updateData)
      //     const result = await portfolioData.updateOne({ _id }, { $set: {...updateData} }, options);
      //     if (result.modifiedCount !== 1) {
      //       console.log(`Failed to update document with id ${_id}`);
      //     }
      //   }
      //   res.status(200).send('Portfolio data updated successfully');
      // } catch (err) {
      //   console.error(err);
      //   res.status(500).send('Internal Server Error');
      // }
    });

  }  finally {
    // await client.close();
  }
  }
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Welcome to Lateef Creation V4')
})

app.listen(port, () => {
  console.log(`Port - ${port}`)
})