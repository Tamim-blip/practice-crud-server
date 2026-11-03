
import express from "express"

import cors from "cors"

import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())





const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSEORD}@cluster0.rq4s4al.mongodb.net/`);


export const connectMongoDB = async () => {
    try {

       await client.connect();
      console.log("You successfully connected to MongoDB!");
      return client;
        
    } catch (error) {
         console.dir(error);
    }
}


 const connectedDB = await connectMongoDB()
 const db = connectedDB.db("practice-crud-operation")
 const users = db.collection("users")




app.get("/", (req, res) => {
    res.send("Hello World")
})

app.get('/users', async(req, res) => {

    const cursor = users.find({})
    const allData = await cursor.toArray()
    res.send(allData)
})

app.get("/users/:id", async(req, res) => {

    const id = req.params.id

    const query = {_id : new ObjectId(id)}

    const result = await users.findOne(query)

    res.send(result)
})


app.post("/users", async(req, res) => {

    const newData = req.body
    const result = await users.insertOne(newData)

    res.send(result)
})



app.delete("/users/:id", async(req, res) => {

    const id = req.params.id
    const query = {_id : new ObjectId(id)}
    const result = await users.deleteOne(query)

    res.send(result)
})


app.patch("/users/:id", async(req, res) => {

    const id = req.params.id

    const updatedUser = req.body
    const filter = {
        _id : new ObjectId(id)
    }
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        name : updatedUser.name,
        email : updatedUser.email
      },
    };

    const result = await users.updateOne(filter, updateDoc, options)

    res.send(result)
})


app.listen(PORT, () => {
    console.log("experiment server on port", PORT)
})
