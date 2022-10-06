const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
var cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@lateef-creation-portfol.s0jnuyt.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();

    const portfolioUpload = client.db('portfolio').collection('portfolio-data');
    module.exports = (req, res) => {
      if (req.method === 'GET') {
    
          const query = {};
          const cursor = portfolioUpload.find(query);
          const data =  cursor.toArray();
          res.send(data);
       
      }
    }

    app.post('/portfolio-upload', (req, res) => {
      const addData = req.body;
      const result = portfolioUpload.insertOne(addData)
      res.send(result)

    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

