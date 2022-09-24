const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = "mongodb+srv://lateef-creation:01534871992@cluster0.lbmxdci.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
      await client.connect();
      const portfolioUpload = client.db('portfolio').collection('portfolio-data');
  
      app.get('/portfolio-data', async (req,res) =>{
        const query = {};
        const cursor = portfolioUpload.find(query);
        const data = await cursor.toArray();
        res.send(data);
      });


      app.post('/portfolio-upload', (req, res) =>{
        const addData = req.body;
        const result = portfolioUpload.insertOne(addData)
        res.send(result)
  
      })
      
    } finally {
      // await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res) => {
    res.send('Welcome to Lateef Creation V2')
  })
  
  app.listen(port, () => {
    console.log(`Port - ${port}`)
  })